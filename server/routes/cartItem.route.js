import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartItem.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/addtocart/:productId", isAuthenticated, addToCart);
router.get("/getallcartproduct", isAuthenticated, getUserCart);
router.patch("/updatecart/:id", isAuthenticated, updateCartItem);
router.delete("/deletecartitem/:id", isAuthenticated, removeCartItem);
router.delete("/deletcart", isAuthenticated, clearCart);

export default router;
