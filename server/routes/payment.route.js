import express from "express";
import { createCheckoutSession,  sessionSuccess } from "../controllers/payment.controller.js";
import { validateCreateCheckoutSession, validateSessionId } from "../validators/payment.validator.js";

const route = express.Router();

route.post("/create-checkout-session", validateCreateCheckoutSession, createCheckoutSession);
route.get("/sessionsuccess/:sessionId", validateSessionId, sessionSuccess);
// route.get("/sessioncancel/:sessionId", sessionCancel);


export default route;
