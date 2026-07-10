import ApiError from "../utils/apiError.js";

export const validateRegisterUser = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!req.file) {
    return next(new ApiError(400, "Profile image is required"));
  }
  if (!firstName || !lastName || !email || !password) {
    return next(new ApiError(400, "First name, last name, email, and password are required"));
  }

  next();
};

export const validateLoginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  next();
};

export const validateUpdatePassword = (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ApiError(400, "All fields are required"));
  }
  if (newPassword !== confirmPassword) {
    return next(new ApiError(400, "New password and confirm password must match"));
  }

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(400, "Email is required"));
  }

  next();
};

export const validateVerifyOtp = (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ApiError(400, "Email and OTP are required"));
  }

  next();
};

export const validateResetPassword = (req, res, next) => {
  const { newPassword, confirmPassword, email } = req.body;

  if (!newPassword || !confirmPassword || !email) {
    return next(new ApiError(400, "Both passwords are required and email is required"));
  }
  if (newPassword !== confirmPassword) {
    return next(new ApiError(400, "Passwords do not match"));
  }

  next();
};
