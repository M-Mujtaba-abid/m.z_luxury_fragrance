import express from "express";
import {
  submitTestimonial,
  getPublicList,
  getAdminList,
  approveTestimonial,
  editTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  validateSubmitTestimonial,
  validateToggleStatus,
  validateEditTestimonial,
} from "../validators/testimonial.validator.js";

const router = express.Router();

router.post("/", validateSubmitTestimonial, submitTestimonial);
router.get("/", getPublicList);

router.get("/admin", isAuthenticated, isAdmin, getAdminList);
router.patch("/admin/:id/status", isAuthenticated, isAdmin, validateToggleStatus, approveTestimonial);
router.patch("/admin/:id", isAuthenticated, isAdmin, validateEditTestimonial, editTestimonial);
router.delete("/admin/:id", isAuthenticated, isAdmin, deleteTestimonial);

export default router;
