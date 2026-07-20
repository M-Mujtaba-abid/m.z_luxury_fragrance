import ApiError from "../utils/apiError.js";

const VALID_GENDERS = ["male", "female"];

const isValidRating = (rating) => {
  const num = Number(rating);
  return !isNaN(num) && num >= 1 && num <= 5;
};

export const validateSubmitTestimonial = (req, res, next) => {
  const { name, country, rating, gender, thinking } = req.body;

  if (!name || !name.trim()) {
    return next(new ApiError(400, "Name is required"));
  }
  if (!country || !country.trim()) {
    return next(new ApiError(400, "Country is required"));
  }
  if (rating === undefined || !isValidRating(rating)) {
    return next(new ApiError(400, "Rating is required and must be between 1 and 5"));
  }
  if (!gender || !VALID_GENDERS.includes(gender)) {
    return next(new ApiError(400, "Gender must be either 'male' or 'female'"));
  }
  if (!thinking || !thinking.trim()) {
    return next(new ApiError(400, "Thinking/feedback message is required"));
  }

  next();
};

export const validateToggleStatus = (req, res, next) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid testimonial id is required"));
  }
  if (typeof isActive !== "boolean") {
    return next(new ApiError(400, "isActive must be a boolean"));
  }

  next();
};

export const validateEditTestimonial = (req, res, next) => {
  const { id } = req.params;
  const { name, country, rating, gender, thinking } = req.body;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid testimonial id is required"));
  }

  if ([name, country, rating, gender, thinking].every((field) => field === undefined)) {
    return next(new ApiError(400, "At least one field must be provided to update the testimonial"));
  }

  if (name !== undefined && !name.trim()) {
    return next(new ApiError(400, "Name cannot be empty"));
  }
  if (country !== undefined && !country.trim()) {
    return next(new ApiError(400, "Country cannot be empty"));
  }
  if (rating !== undefined && !isValidRating(rating)) {
    return next(new ApiError(400, "Rating must be between 1 and 5"));
  }
  if (gender !== undefined && !VALID_GENDERS.includes(gender)) {
    return next(new ApiError(400, "Gender must be either 'male' or 'female'"));
  }
  if (thinking !== undefined && !thinking.trim()) {
    return next(new ApiError(400, "Thinking/feedback message cannot be empty"));
  }

  next();
};
