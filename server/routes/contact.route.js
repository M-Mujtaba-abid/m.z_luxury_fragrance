import express from "express";
import {
  submitMessage,
  getMessages,
  adminReply,
} from "../controllers/contact.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  validateSubmitMessage,
  validateAdminReply,
} from "../validators/contact.validator.js";

const router = express.Router();

router.post("/", validateSubmitMessage, submitMessage);
router.get("/", isAuthenticated, isAdmin, getMessages);
router.post("/:id/reply", isAuthenticated, isAdmin, validateAdminReply, adminReply);

export default router;
