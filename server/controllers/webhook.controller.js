import * as webhookService from "../services/webhook.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];

  const event = webhookService.constructStripeEvent({ payload: req.body, signature });

  await webhookService.handleStripeEvent(event);

  return res
    .status(200)
    .json(new ApiResponse(200, { received: true }, "Webhook processed"));
});
