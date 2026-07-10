import * as cartItemService from "../services/cartItem.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user?.id;
  const guestId = req.guestId;

  const cartItem = await cartItemService.addToCart({ userId, guestId, productId, quantity });

  res.status(201).json(new ApiResponse(201, cartItem, "Item added to cart successfully"));
});

// Get all cart items of logged-in user or guest
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

  const cartItems = await cartItemService.getUserCart({ userId, guestId });

  res.status(200).json(new ApiResponse(200, cartItems, "Cart fetched successfully"));
});

// Update quantity of cart item
export const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user?.id;
  const guestId = req.guestId;

  const cartItem = await cartItemService.updateCartItem({ id, userId, guestId, quantity });

  res.status(200).json(new ApiResponse(200, cartItem, "Cart item updated successfully"));
});

// Remove cart item
export const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const guestId = req.guestId;

  await cartItemService.removeCartItem({ id, userId, guestId });

  res.status(200).json(new ApiResponse(200, {}, "Cart item removed successfully"));
});

// Clear all cart items
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

  await cartItemService.clearCart({ userId, guestId });

  res.status(200).json(new ApiResponse(200, {}, "Cart cleared successfully"));
});
