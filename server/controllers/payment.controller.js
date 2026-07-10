import * as paymentService from "../services/payment.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  // userId/guestId are derived server-side from identifyUser (not trusted
  // from the request body) so a guest can't spoof someone else's userId
  const userId = req.user?.id;
  const guestId = req.user ? undefined : req.guestId;

  const session = await paymentService.createCheckoutSession({ ...req.body, userId, guestId });

  res.status(200).json(session);
});

export const sessionSuccess = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await paymentService.getCheckoutSession({ sessionId });

  res.status(200).json(session);
});
