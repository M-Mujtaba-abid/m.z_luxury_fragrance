import { fn, col } from "sequelize";
import Review from "../models/review.model.js";
import ReviewHelpfulVote from "../models/reviewHelpfulVote.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import uploadBufferToCloudinary from "../utils/cloudinaryUpload.js";

const reviewerIncludes = [
  { model: User, attributes: ["id", "firstName", "lastName"] },
];

// Post-moderation: a review goes live the instant it's created, no
// approval step. Admins can only remove it afterwards (see deleteReview).
export const createReview = async ({ userId, productId, orderId, rating, comment, files }) => {
  const order = await Order.findByPk(orderId);
  if (!order || order.userId !== userId) {
    throw new ApiError(404, "Order not found");
  }
  if (order.status !== "delivered") {
    throw new ApiError(400, "You can only review products from delivered orders");
  }

  const orderItem = await OrderItem.findOne({ where: { orderId, productId } });
  if (!orderItem) {
    throw new ApiError(400, "This product was not part of that order");
  }

  const existing = await Review.findOne({ where: { userId, productId, orderId } });
  if (existing) {
    throw new ApiError(409, "You have already reviewed this product for this order");
  }

  let images = [];
  if (files?.length) {
    const uploaded = await Promise.all(
      files.map((f) => uploadBufferToCloudinary(f.buffer, "reviews"))
    );
    images = uploaded.map((r) => r.secure_url);
  }

  try {
    const review = await Review.create({
      userId,
      productId,
      orderId,
      rating,
      comment: comment || null,
      images,
    });
    return Review.findByPk(review.id, { include: reviewerIncludes });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new ApiError(409, "You have already reviewed this product for this order");
    }
    throw error;
  }
};

export const getProductReviews = async ({ productId, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { rows: reviews, count: totalReviews } = await Review.findAndCountAll({
    where: { productId },
    include: reviewerIncludes,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const ratingRows = await Review.findAll({
    where: { productId },
    attributes: ["rating", [fn("COUNT", col("id")), "count"]],
    group: ["rating"],
    raw: true,
  });

  const countsByRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingRows.forEach((row) => {
    countsByRating[row.rating] = Number(row.count);
  });

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: countsByRating[star],
    percentage: totalReviews ? Math.round((countsByRating[star] / totalReviews) * 100) : 0,
  }));

  const averageRating = totalReviews
    ? Number(
        (
          [5, 4, 3, 2, 1].reduce((sum, star) => sum + star * countsByRating[star], 0) /
          totalReviews
        ).toFixed(2)
      )
    : 0;

  return { reviews, page, limit, totalReviews, averageRating, ratingBreakdown };
};

// Delivered order-items for this user that don't have a review yet —
// drives the "Write a Review" button on the order history page.
export const getEligibleOrderItems = async ({ userId }) => {
  const orders = await Order.findAll({
    where: { userId, status: "delivered" },
    include: [{ model: OrderItem, include: [{ model: Product, attributes: ["id", "title", "productImage"] }] }],
  });

  const reviewedRows = await Review.findAll({
    where: { userId },
    attributes: ["productId", "orderId"],
    raw: true,
  });
  const reviewedKeys = new Set(reviewedRows.map((r) => `${r.orderId}:${r.productId}`));

  const eligible = [];
  orders.forEach((order) => {
    order.OrderItems?.forEach((item) => {
      if (!item.Product) return;
      const key = `${order.id}:${item.productId}`;
      if (reviewedKeys.has(key)) return;
      eligible.push({
        orderId: order.id,
        orderItemId: item.id,
        productId: item.productId,
        productTitle: item.Product.title,
        productImage: item.Product.productImage,
        deliveredOn: order.updatedAt,
      });
    });
  });

  return eligible;
};

// Admin-only — see isAdmin middleware on the route.
export const deleteReview = async ({ id }) => {
  const review = await Review.findByPk(id);
  if (!review) throw new ApiError(404, "Review not found");
  await review.destroy();
};

export const getAllReviewsForAdmin = async () => {
  return Review.findAll({
    include: [
      { model: User, attributes: ["id", "firstName", "lastName", "email"] },
      { model: Product, attributes: ["id", "title", "productImage"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

// Toggle: mark helpful if not already voted, un-mark if already voted.
export const toggleHelpful = async ({ reviewId, userId }) => {
  const review = await Review.findByPk(reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  const existingVote = await ReviewHelpfulVote.findOne({ where: { reviewId, userId } });

  if (existingVote) {
    await existingVote.destroy();
    await review.decrement("helpfulCount");
    await review.reload();
    return { helpful: false, helpfulCount: review.helpfulCount };
  }

  try {
    await ReviewHelpfulVote.create({ reviewId, userId });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new ApiError(409, "You have already marked this review as helpful");
    }
    throw error;
  }
  await review.increment("helpfulCount");
  await review.reload();
  return { helpful: true, helpfulCount: review.helpfulCount };
};

// Used by product.service.js to merge averageRating/reviewCount into
// product list/detail responses without denormalizing onto Product itself.
export const getRatingSummaryForProducts = async (productIds) => {
  if (!productIds.length) return {};

  const rows = await Review.findAll({
    where: { productId: productIds },
    attributes: [
      "productId",
      [fn("AVG", col("rating")), "averageRating"],
      [fn("COUNT", col("id")), "reviewCount"],
    ],
    group: ["productId"],
    raw: true,
  });

  const summary = {};
  rows.forEach((row) => {
    summary[row.productId] = {
      averageRating: Number(Number(row.averageRating).toFixed(2)),
      reviewCount: Number(row.reviewCount),
    };
  });
  return summary;
};
