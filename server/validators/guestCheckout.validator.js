import ApiError from "../utils/apiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email) => typeof email === "string" && EMAIL_REGEX.test(email);

const isValidPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};

// Extra checks that only apply to guest checkout - logged-in users already
// have a verified account, so we don't need to be this strict on them.
// Must run after identifyUser so req.user is populated for logged-in users.
export const validateGuestCheckout = (req, res, next) => {
  if (req.user) return next();

  const { customerEmail, customerPhone, shippingStreet, shippingCity, shippingCountry } =
    req.body;

  if (!isValidEmail(customerEmail)) {
    return next(new ApiError(400, "A valid email is required for guest checkout"));
  }
  if (!isValidPhone(customerPhone)) {
    return next(new ApiError(400, "A valid phone number is required for guest checkout"));
  }
  if (!shippingStreet || !shippingCity || !shippingCountry) {
    return next(new ApiError(400, "Complete shipping address is required for guest checkout"));
  }

  next();
};

export const validateTrackOrder = (req, res, next) => {
  const { id } = req.params;
  const { email } = req.query;

  if (!id || isNaN(Number(id))) {
    return next(new ApiError(400, "Valid order id is required"));
  }
  if (!isValidEmail(email)) {
    return next(new ApiError(400, "A valid email is required to track this order"));
  }

  next();
};
