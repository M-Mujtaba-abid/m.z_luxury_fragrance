import express from "express";
import { stripeWebhook } from "../controllers/webhook.controller.js";
import bodyParser from "body-parser";

const route = express.Router();

// Stripe requires raw body for signature verification
route.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), // ⚡ Correct
  stripeWebhook
);

export default route;
