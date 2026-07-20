import express from "express";
import {
  toggleWishlist,
  getUserWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";
import { identifyUser } from "../middleware/identifyUser.js";
import { validateProductIdParam } from "../validators/wishlist.validator.js";

const router = express.Router();

router.post("/toggle/:productId", identifyUser, validateProductIdParam, toggleWishlist);
router.get("/getallwishlist", identifyUser, getUserWishlist);
router.delete("/deletewishlistitem/:productId", identifyUser, validateProductIdParam, removeFromWishlist);
router.delete("/deletewishlist", identifyUser, clearWishlist);

export default router;
