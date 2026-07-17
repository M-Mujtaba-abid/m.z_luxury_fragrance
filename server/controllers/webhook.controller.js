import * as webhookService from "../services/webhook.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
<<<<<<< HEAD
import ApiError from "../utils/apiError.js";
import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
=======
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

export const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];

  const event = webhookService.constructStripeEvent({ payload: req.body, signature });

  await webhookService.handleStripeEvent(event);

<<<<<<< HEAD
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

      const order = await Order.create({
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

      // Note: no OrderItem rows exist for this flow yet (pre-existing gap,
      // unrelated to variants) so this confirmation is order-total only.
      try {
        await sendOrderConfirmationEmail(order, []);
      } catch (err) {
        console.error("Order confirmation email failed:", err);
      }
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
=======
  return res
    .status(200)
    .json(new ApiResponse(200, { received: true }, "Webhook processed"));
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44
});
