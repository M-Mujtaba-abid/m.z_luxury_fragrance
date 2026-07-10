import ApiError from "../utils/apiError.js";

const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export const validateCreateOrder = (req, res, next) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingStreet,
    shippingCity,
    shippingCountry,
  } = req.body;

  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !shippingStreet ||
    !shippingCity ||
    !shippingCountry
  ) {
    return next(new ApiError(400, "All required fields must be provided"));
  }

  next();
};

export const validateUpdateOrderStatus = (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid order id is required"));
  }
  if (!status || !ORDER_STATUSES.includes(status)) {
    return next(new ApiError(400, `Status must be one of: ${ORDER_STATUSES.join(", ")}`));
  }

  next();
};

export const validateOrderId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid order id is required"));
  }

  next();
};
