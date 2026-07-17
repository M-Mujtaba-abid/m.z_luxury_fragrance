import * as userService from "../services/user.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const user = await userService.registerUser({ ...req.body, file: req.file });

  const guestId = req.cookies?.guestId;
  await userService.mergeGuestData({ guestId, email: user.email, userId: user.id });
  if (guestId) res.clearCookie("guestId", { path: "/" });

  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { token, user } = await userService.loginUser(req.body);

  const guestId = req.cookies?.guestId;
  await userService.mergeGuestData({ guestId, email: user.email, userId: user.id });
  if (guestId) res.clearCookie("guestId", { path: "/" });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, // false on localhost, true on prod
    sameSite: isProd ? "none" : "lax", // none for cross-site prod, lax on localhost
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(new ApiResponse(200, { user, token }, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});

const totalUser = asyncHandler(async (req, res) => {
  const totalUser = await userService.getTotalUsers();

  res
    .status(200)
    .json(new ApiResponse(200, { totalUser }, "Total number of orders fetched successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  // user is already attached from middleware
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile retrieved successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile({
    userId: req.user.id,
    ...req.body,
    file: req.file,
  });

  res.status(200).json(new ApiResponse(200, user, "User profile updated successfully"));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  await userService.updatePassword({ userId: req.user.id, oldPassword, newPassword });

  res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  await userService.forgotPassword({ email: req.body.email });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent to your email successfully"));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await userService.verifyOtp({ email, otp });

  res.status(200).json(new ApiResponse(200, {}, "OTP verified successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  await userService.resetPassword({ email, newPassword });

  res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  totalUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
