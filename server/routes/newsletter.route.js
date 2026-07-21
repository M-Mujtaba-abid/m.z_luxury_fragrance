import express from "express";
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  sendNewsletter,
} from "../controllers/newsletter.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { validateSubscribe, validateSendNewsletter } from "../validators/newsletter.validator.js";

const router = express.Router();

router.post("/subscribe", validateSubscribe, subscribe);
router.get("/unsubscribe/:token", unsubscribe);

router.get("/admin/subscribers", isAuthenticated, isAdmin, getSubscribers);
router.post("/admin/send", isAuthenticated, isAdmin, validateSendNewsletter, sendNewsletter);

export default router;
