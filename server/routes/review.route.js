import express from "express";
import {
  createReview,
  getProductReviews,
  getEligibleOrderItems,
  deleteReview,
  getAllReviewsForAdmin,
  toggleHelpful,
} from "../controllers/review.controller.js";
import { upload } from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  validateCreateReview,
  validateReviewId,
  validateProductIdParam,
} from "../validators/review.validator.js";

const router = express.Router();

const reviewImageUpload = upload.fields([{ name: "images", maxCount: 5 }]);

router.post("/create", isAuthenticated, reviewImageUpload, validateCreateReview, createReview);
router.get("/product/:productId", validateProductIdParam, getProductReviews);
router.get("/eligible", isAuthenticated, getEligibleOrderItems);
router.get("/admin/all", isAuthenticated, isAdmin, getAllReviewsForAdmin);
router.delete("/delete/:id", isAuthenticated, isAdmin, validateReviewId, deleteReview);
router.post("/helpful/:id", isAuthenticated, validateReviewId, toggleHelpful);

export default router;
