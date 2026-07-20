import * as wishlistService from "../services/wishlist.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Toggle product in/out of the wishlist of the logged-in user or guest
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id;
  const guestId = req.guestId;

  const result = await wishlistService.toggleWishlist({ userId, guestId, productId });

  if (result.status === "added") {
    return res.status(201).json(new ApiResponse(201, result.item, "Product added to wishlist"));
  }

  res.status(200).json(new ApiResponse(200, null, "Product removed from wishlist"));
});

// Get all wishlist items of logged-in user or guest
export const getUserWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

  const wishlistItems = await wishlistService.getUserWishlist({ userId, guestId });

  res.status(200).json(
    new ApiResponse(200, { items: wishlistItems, total: wishlistItems.length }, "Wishlist fetched successfully")
  );
});

// Remove a single product from the wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id;
  const guestId = req.guestId;

  await wishlistService.removeFromWishlist({ userId, guestId, productId });

  res.status(200).json(new ApiResponse(200, null, "Product removed from wishlist"));
});

// Clear all wishlist items
export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

  await wishlistService.clearWishlist({ userId, guestId });

  res.status(200).json(new ApiResponse(200, null, "Wishlist cleared successfully"));
});
