import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartItem.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  validateAddToCart,
  validateUpdateCartItem,
  validateCartItemId,
} from "../validators/cartItem.validator.js";

const router = express.Router();

router.post("/addtocart/:productId", isAuthenticated, validateAddToCart, addToCart);
router.get("/getallcartproduct", isAuthenticated, getUserCart);
router.patch("/updatecart/:id", isAuthenticated, validateUpdateCartItem, updateCartItem);
router.delete("/deletecartitem/:id", isAuthenticated, validateCartItemId, removeCartItem);
router.delete("/deletcart", isAuthenticated, clearCart);

export default router;
