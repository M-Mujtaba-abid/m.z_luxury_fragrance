import ApiError from "../utils/apiError.js";

export const validateCreateReview = (req, res, next) => {
  const { orderId, productId, rating } = req.body;

  if (!orderId || isNaN(Number(orderId))) {
    return next(new ApiError(400, "Valid orderId is required"));
  }
  if (!productId || isNaN(Number(productId))) {
    return next(new ApiError(400, "Valid productId is required"));
  }
  if (!rating || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    return next(new ApiError(400, "Rating must be a number between 1 and 5"));
  }

  next();
};

export const validateReviewId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid review id is required"));
  }

  next();
};

export const validateProductIdParam = (req, res, next) => {
  const { productId } = req.params;

  if (!productId || isNaN(Number(productId))) {
    return next(new ApiError(400, "Valid product id is required"));
  }

  next();
};
