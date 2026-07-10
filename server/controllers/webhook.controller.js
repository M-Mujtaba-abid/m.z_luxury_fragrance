// stripeWebhook.controller.js
import Stripe from "stripe";
import Order from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new ApiError(400, `Webhook Error: ${err.message}`);
  }

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

    return res
      .status(200)
      .json(new ApiResponse(200, { received: true }, "Webhook processed"));
  } catch (error) {
    throw new ApiError(500, "Failed to process webhook event");
  }
});
