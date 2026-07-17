<<<<<<< HEAD
import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
=======
import * as cartItemService from "../services/cartItem.service.js";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
<<<<<<< HEAD
  const { quantity, variantId } = req.body;
=======
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user?.id;
  const guestId = req.guestId;

  const cartItem = await cartItemService.addToCart({ userId, guestId, productId, quantity });

<<<<<<< HEAD
  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, "Product not found");

  // variantId is optional — legacy/single-size products keep working with no variant selected
  let variant = null;
  if (variantId) {
    variant = await ProductVariant.findOne({
      where: { id: variantId, productId },
    });
    if (!variant) throw new ApiError(404, "Product variant not found");
  }
  const unitPrice = variant ? variant.price : product.price;

  // check if already in cart (same product + same variant = same line item)
  let cartItem = await CartItem.findOne({
    where: { userId, productId, variantId: variant ? variant.id : null },
  });

  if (cartItem) {
    // update quantity only, priceAtAddition same rahega
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    // create new cart item with snapshot price
    cartItem = await CartItem.create({
      userId,
      productId,
      variantId: variant ? variant.id : null,
      quantity,
      priceAtAddition: unitPrice, // snapshot store
    });
  }

  // calculate total dynamically
  const totalPrice = cartItem.quantity * cartItem.priceAtAddition;

  res.status(201).json(
    new ApiResponse(201, { ...cartItem.toJSON(), totalPrice }, "Item added to cart successfully")
  );
=======
  res.status(201).json(new ApiResponse(201, cartItem, "Item added to cart successfully"));
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44
});

// Get all cart items of logged-in user or guest
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

<<<<<<< HEAD
  const cartItems = await CartItem.findAll({
    where: { userId },
    include: [
      { model: Product },
      { model: ProductVariant },
      { model: User, attributes: ["id", "firstName", "email"] },
    ],
  });
=======
  const cartItems = await cartItemService.getUserCart({ userId, guestId });
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

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
