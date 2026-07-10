import stripe from "../config/stripe.js";
import Order from "../models/order.model.js";
import CartItem from "../models/CartItem.model.js";
import ApiError from "../utils/apiError.js";
import sendOrderConfirmationEmail from "../utils/sendOrderConfirmationEmail.js";

export const constructStripeEvent = ({ payload, signature }) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new ApiError(400, `Webhook Error: ${err.message}`);
  }
};

export const handleStripeEvent = async (event) => {
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const paymentIntentId = session.payment_intent;
      const transactionId = session.id;
      const paymentDate = new Date();

      // Stripe stores metadata as strings, so userId/guestId come back as
      // "5"/"" rather than a real number/null - normalize them here.
      const {
        userId,
        guestId,
        customerName,
        customerEmail,
        customerPhone,
        shippingStreet,
        shippingCity,
        shippingState,
        shippingPostalCode,
        shippingCountry,
        totalAmount,
      } = session.metadata;

      const resolvedUserId = userId ? Number(userId) : null;
      const resolvedGuestId = resolvedUserId ? null : guestId || null;

      const order = await Order.create({
        userId: resolvedUserId,
        guestId: resolvedGuestId,
        guestEmail: resolvedUserId ? null : customerEmail,
        customerName,
        customerEmail,
        customerPhone,
        shippingStreet,
        shippingCity,
        shippingState,
        shippingPostalCode,
        shippingCountry,
        totalAmount,
        paymentMethod: "CreditCard",
        paymentStatus: "paid",
        paymentIntentId,
        transactionId,
        paymentDate,
        status: "confirmed",
      });

      // Only clear the cart when we can positively identify its owner - an
      // empty where-clause here would match (and wipe) every logged-in
      // user's cart, since guestId is NULL for all of them.
      if (resolvedUserId || resolvedGuestId) {
        const owner = resolvedUserId ? { userId: resolvedUserId } : { guestId: resolvedGuestId };
        await CartItem.destroy({ where: owner });
      } else {
        console.warn("Stripe webhook: no userId/guestId in session metadata, skipped cart clear");
      }

      try {
        await sendOrderConfirmationEmail({ order, items: [] });
      } catch (error) {
        // order/payment already succeeded - a failed email shouldn't fail the webhook
        console.error("Failed to send order confirmation email:", error);
      }

      console.log("✅ Order saved to DB after payment success");
    }

    if (event.type === "payment_intent.payment_failed") {
      console.log("❌ Payment failed");
    }
  } catch (error) {
    throw new ApiError(500, "Failed to process webhook event");
  }
};
