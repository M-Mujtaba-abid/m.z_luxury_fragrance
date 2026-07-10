import express from "express";
import { createCheckoutSession,  sessionSuccess } from "../controllers/payment.controller.js";

const route = express.Router();

route.post("/create-checkout-session", createCheckoutSession);
route.get("/sessionsuccess/:sessionId", sessionSuccess);
// route.get("/sessioncancel/:sessionId", sessionCancel);


export default route;
