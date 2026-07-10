import ApiError from "../utils/apiError.js";

export const validateCreateCheckoutSession = (req, res, next) => {
  const {
    items,
    customerName,
    customerEmail,
    customerPhone,
    shippingStreet,
    shippingCity,
    shippingCountry,
    totalAmount,
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new ApiError(400, "At least one item is required"));
  }
  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !shippingStreet ||
    !shippingCity ||
    !shippingCountry ||
    !totalAmount
  ) {
    return next(new ApiError(400, "All customer and shipping fields are required"));
  }

  next();
};

export const validateSessionId = (req, res, next) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return next(new ApiError(400, "Session id is required"));
  }

  next();
};
