import ApiError from "../utils/apiError.js";

export const validateAddToCart = (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!productId || isNaN(Number(productId))) {
    return next(new ApiError(400, "Valid productId is required"));
  }
  if (quantity === undefined || isNaN(Number(quantity)) || Number(quantity) < 1) {
    return next(new ApiError(400, "Quantity must be a number greater than 0"));
  }

  next();
};

export const validateUpdateCartItem = (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid cart item id is required"));
  }
  if (quantity === undefined || isNaN(Number(quantity)) || Number(quantity) < 1) {
    return next(new ApiError(400, "Quantity must be a number greater than 0"));
  }

  next();
};

export const validateCartItemId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid cart item id is required"));
  }

  next();
};
