import * as compareService from "../services/compare.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Toggle product in/out of the compare list of the logged-in user or guest.
// The 2-item limit is enforced in compare.service.js and thrown as an
// ApiError(400, ...), which asyncHandler forwards to errorMiddleware.
export const toggleCompare = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id;
  const guestId = req.guestId;

  const result = await compareService.toggleCompare({ userId, guestId, productId });

  if (result.status === "added") {
    return res.status(201).json(new ApiResponse(201, result.item, "Product added to compare list"));
  }

  res.status(200).json(new ApiResponse(200, null, "Product removed from compare list"));
});

// Get all compare items of logged-in user or guest
export const getUserCompareList = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

  const compareItems = await compareService.getUserCompareList({ userId, guestId });

  res.status(200).json(
    new ApiResponse(200, { items: compareItems, total: compareItems.length }, "Compare list fetched successfully")
  );
});

// Remove a single product from the compare list
export const removeFromCompare = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id;
  const guestId = req.guestId;

  await compareService.removeFromCompare({ userId, guestId, productId });

  res.status(200).json(new ApiResponse(200, null, "Product removed from compare list"));
});

// Clear the whole compare list
export const clearCompareList = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

  await compareService.clearCompareList({ userId, guestId });

  res.status(200).json(new ApiResponse(200, null, "Compare list cleared successfully"));
});
