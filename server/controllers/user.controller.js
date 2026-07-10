import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken" 
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import sendEmail from "../utils/sendEmail.js";




const registerUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber, address, userRole } = req.body;

  // Check if file uploaded
  if (!req.file) {
    return next(new ApiError(400, "Profile image is required"));
  }

  // Upload image using stream
  const streamUpload = (reqFile) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "users" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(reqFile.buffer).pipe(stream);
    });
  };

  const uploadedImage = await streamUpload(req.file);

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return next(new ApiError(400, "First name, last name, email, and password are required"));
  }

  // Check if email exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new ApiError(400, "Email already registered"));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
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

  // Prepare response
  const userResponse = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
    address: newUser.address,
    userRole: newUser.userRole,
    profileImage: newUser.profileImage,
    status: newUser.status,
    createdAt: newUser.createdAt,
  };

  res.status(201).json(new ApiResponse(201, userResponse, "User registered successfully"));
});

 const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password , userRole } = req.body;

  // 1️⃣ Validate input
  if (!email || !password ) {
    return next(new ApiError(400, "Email and password are required"));
  }

  // 2️⃣ Check user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new ApiError(400, "Invalid email or password"));
  }

  // 3️⃣ Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ApiError(400, "Invalid email or password"));
  }

  if (userRole && userRole !== user.userRole) {
    return next(new ApiError(403, "You are not authorized for this role"));
  }

  // 4️⃣ Generate JWT Token
  const token = jwt.sign(
    { id: user.id, role: user.userRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 5️⃣ Prepare response (remove password)
  const userResponse = {
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
  };

 
 
 const isProd = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProd,                 // false on localhost, true on prod
  sameSite: isProd ? "none" : "lax", // none for cross-site prod, lax on localhost
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
  res.status(200).json(new ApiResponse(200, { user: userResponse, token }, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});

const totalUser =asyncHandler(async(req,res)=>{
  const  totalUser=await User.count()

  res.status(200).json({
    success: true,
    message: "Total number of orders fetched successfully",
    data: { totalUser },
  });
})


const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    // user is already attached from middleware
    const user = req.user;

    res.status(200).json(
      new ApiResponse(200, user, "User profile retrieved successfully")
    );
  } catch (error) {
    next(new ApiError(500, "Error retrieving user profile"));
  }
});


const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address } = req.body;
  const file = req.file;

  // Helper to upload file to Cloudinary via stream
  const streamUpload = (reqFile) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "users" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(reqFile.buffer).pipe(stream);
    });
  };

  let profileImageUrl;
  if (file) {
    const uploaded = await streamUpload(file);
    profileImageUrl = uploaded.secure_url;
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.address = address || user.address;
  if (profileImageUrl) user.profileImage = profileImageUrl;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: user,
  });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // 1️⃣ Validate fields
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ApiError(400, "All fields are required"));
  }

  // 2️⃣ Check new password & confirm
  if (newPassword !== confirmPassword) {
    return next(new ApiError(400, "New password and confirm password must match"));
  }

  // 3️⃣ Find logged-in user
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // 4️⃣ Match old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return next(new ApiError(400, "Old password is incorrect"));
  }

  // 5️⃣ Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 6️⃣ Save new password
  user.password = hashedPassword;
  await user.save();

  // 7️⃣ Response
  res.status(200).json(
    new ApiResponse(200, {}, "Password updated successfully")
  );
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ApiError(400, "Email is required"));

  const user = await User.findOne({ where: { email } });
  if (!user) return next(new ApiError(404, "User not found"));

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP + expiry
  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();

  // Send email
  await sendEmail(
    user.email,
    "Password Reset OTP",
    `Your OTP is: ${otp}. It is valid for 10 minutes.`
  );

  res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent to your email successfully"));
});


const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ApiError(400, "Email and OTP are required"));
  }

  const user = await User.findOne({ where: { email } });
  if (!user || user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
    return next(new ApiError(400, "Invalid or expired OTP"));
  }

  res.status(200).json(
    new ApiResponse(200, {}, "OTP verified successfully")
  );
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { newPassword, confirmPassword, email } = req.body;
  
  if (!newPassword || !confirmPassword || !email ) {
    return next(new ApiError(400, "Both passwords are required and email is required "));
  }

  if (newPassword !== confirmPassword) {
    return next(new ApiError(400, "Passwords do not match"));
  }

  const user = await User.findOne({ where: { email } });
  if (!user) return next(new ApiError(404, "User not found"));

  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});



export {registerUser ,loginUser, logoutUser, totalUser, getUserProfile,updateUserProfile ,updatePassword, forgotPassword, verifyOtp , resetPassword}