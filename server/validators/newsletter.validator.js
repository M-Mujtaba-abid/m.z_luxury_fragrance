import ApiError from "../utils/apiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSubscribe = (req, res, next) => {
  const { email } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return next(new ApiError(400, "A valid email is required"));
  }

  next();
};

export const validateSendNewsletter = (req, res, next) => {
  const { subject, message, productIds } = req.body;

  if (!subject || !subject.trim()) {
    return next(new ApiError(400, "Subject is required"));
  }
  if (!message || !message.trim()) {
    return next(new ApiError(400, "Message is required"));
  }
  if (productIds !== undefined && !Array.isArray(productIds)) {
    return next(new ApiError(400, "productIds must be an array"));
  }

  next();
};
