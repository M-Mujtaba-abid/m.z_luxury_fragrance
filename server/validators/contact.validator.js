import ApiError from "../utils/apiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSubmitMessage = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !name.trim()) {
    return next(new ApiError(400, "Name is required"));
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return next(new ApiError(400, "A valid email is required"));
  }
  if (!subject || !subject.trim()) {
    return next(new ApiError(400, "Subject is required"));
  }
  if (!message || !message.trim()) {
    return next(new ApiError(400, "Message is required"));
  }

  next();
};

export const validateAdminReply = (req, res, next) => {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid contact message id is required"));
  }
  if (!replyText || !replyText.trim()) {
    return next(new ApiError(400, "replyText is required"));
  }

  next();
};
