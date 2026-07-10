import stripe from "../config/stripe.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/apiError.js";

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

      const {
        userId,
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

      await Order.create({
        userId,
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

      console.log("✅ Order saved to DB after payment success");
    }

    if (event.type === "payment_intent.payment_failed") {
      console.log("❌ Payment failed");
    }
  } catch (error) {
    throw new ApiError(500, "Failed to process webhook event");
  }
};
