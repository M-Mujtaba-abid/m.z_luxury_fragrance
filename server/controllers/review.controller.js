import * as reviewService from "../services/review.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { orderId, productId, rating, comment } = req.body;
  const review = await reviewService.createReview({
    userId: req.user.id,
    orderId: Number(orderId),
    productId: Number(productId),
    rating: Number(rating),
    comment,
    files: req.files?.images || [],
  });
  res.status(201).json(new ApiResponse(201, review, "Review submitted successfully"));
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await reviewService.getProductReviews({ productId: Number(productId), page, limit });
  res.status(200).json(new ApiResponse(200, result, "Reviews fetched successfully"));
});

export const getEligibleOrderItems = asyncHandler(async (req, res) => {
  const eligible = await reviewService.getEligibleOrderItems({ userId: req.user.id });
  res.status(200).json(new ApiResponse(200, eligible, "Eligible orders fetched successfully"));
});

// Admin-only (see isAdmin middleware on the route).
export const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview({ id: req.params.id });
  res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
});

export const getAllReviewsForAdmin = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAllReviewsForAdmin();
  res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export const toggleHelpful = asyncHandler(async (req, res) => {
  const result = await reviewService.toggleHelpful({
    reviewId: Number(req.params.id),
    userId: req.user.id,
  });
  res.status(200).json(new ApiResponse(200, result, "Helpful vote updated"));
});
