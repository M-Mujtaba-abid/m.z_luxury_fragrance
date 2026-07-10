import ApiError from "../utils/apiError.js";

export const validateCreateProduct = (req, res, next) => {
  const { title, description, status, price, stock, Quantity, category } = req.body;

  if (
    !title ||
    !description ||
    !status ||
    !price ||
    !stock ||
    !req.file ||
    !Quantity ||
    !category
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  next();
};

export const validateProductId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid product id is required"));
  }

  next();
};

export const validateCategoryParam = (req, res, next) => {
  const { category } = req.params;

  if (!category) {
    return next(new ApiError(400, "Category is required"));
  }

  next();
};

export const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ApiError(400, "Search query is required"));
  }

  next();
};
