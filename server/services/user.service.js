import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import uploadBufferToCloudinary from "../utils/cloudinaryUpload.js";
import sendEmail from "../utils/sendEmail.js";

const toSafeUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  address: user.address,
  userRole: user.userRole,
  profileImage: user.profileImage,
  status: user.status,
  createdAt: user.createdAt,
});

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  address,
  userRole,
  file,
}) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new ApiError(400, "Email already registered");

  const uploadedImage = await uploadBufferToCloudinary(file.buffer, "users");
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    address,
    userRole: userRole || "User",
    profileImage: uploadedImage.secure_url,
  });

  return toSafeUser(newUser);
};

export const loginUser = async ({ email, password, userRole }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(400, "Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid email or password");

  if (userRole && userRole !== user.userRole) {
    throw new ApiError(403, "You are not authorized for this role");
  }

  const token = jwt.sign(
    { id: user.id, role: user.userRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user: toSafeUser(user) };
};

export const getTotalUsers = async () => User.count();

export const updateUserProfile = async ({
  userId,
  firstName,
  lastName,
  email,
  phoneNumber,
  address,
  file,
}) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");

  let profileImageUrl;
  if (file) {
    const uploaded = await uploadBufferToCloudinary(file.buffer, "users");
    profileImageUrl = uploaded.secure_url;
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.address = address || user.address;
  if (profileImageUrl) user.profileImage = profileImageUrl;

  await user.save();

  return user;
};

export const updatePassword = async ({ userId, oldPassword, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();

  await sendEmail(
    user.email,
    "Password Reset OTP",
    `Your OTP is: ${otp}. It is valid for 10 minutes.`
  );
};

export const verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }
};

export const resetPassword = async ({ email, newPassword }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};
