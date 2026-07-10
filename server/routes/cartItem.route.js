import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartItem.controller.js";
import { identifyUser } from "../middleware/identifyUser.js";
import {
  validateAddToCart,
  validateUpdateCartItem,
  validateCartItemId,
} from "../validators/cartItem.validator.js";

const router = express.Router();

router.post("/addtocart/:productId", identifyUser, validateAddToCart, addToCart);
router.get("/getallcartproduct", identifyUser, getUserCart);
router.patch("/updatecart/:id", identifyUser, validateUpdateCartItem, updateCartItem);
router.delete("/deletecartitem/:id", identifyUser, validateCartItemId, removeCartItem);
router.delete("/deletcart", identifyUser, clearCart);

export default router;
