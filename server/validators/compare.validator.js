import ApiError from "../utils/apiError.js";

export const validateProductIdParam = (req, res, next) => {
  const { productId } = req.params;

  if (!productId || isNaN(Number(productId))) {
    return next(new ApiError(400, "Valid productId is required"));
  }

  next();
};
