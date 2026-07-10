import express from "express";
import { forgotPassword, getUserProfile, loginUser, logoutUser, registerUser, resetPassword, totalUser, updatePassword, updateUserProfile, verifyOtp } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  validateRegisterUser,
  validateLoginUser,
  validateUpdatePassword,
  validateForgotPassword,
  validateVerifyOtp,
  validateResetPassword,
} from "../validators/user.validator.js";


const router = express.Router();


router.post("/register", upload.single("profileImage"), validateRegisterUser, registerUser);
router.post("/login", validateLoginUser, loginUser);
router.post("/logout", logoutUser);
router.get("/totaluser", totalUser);
router.get("/getuserprofile", isAuthenticated, getUserProfile);
router.patch("/updateuserprofile", isAuthenticated, upload.single("profileImage"), updateUserProfile);
router.patch("/updatepassword", isAuthenticated, validateUpdatePassword, updatePassword);

router.post("/forgetpassword", validateForgotPassword, forgotPassword);
router.post("/verifyotp", validateVerifyOtp, verifyOtp);
router.post("/resetpassword", validateResetPassword, resetPassword);

export default router;
