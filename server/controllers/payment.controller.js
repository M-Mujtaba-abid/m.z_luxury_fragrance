import * as paymentService from "../services/payment.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const session = await paymentService.createCheckoutSession(req.body);

  res.status(200).json(session);
});

export const sessionSuccess = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await paymentService.getCheckoutSession({ sessionId });

  res.status(200).json(session);
});
