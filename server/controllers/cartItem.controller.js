import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import resolveOwner from "../utils/resolveOwner.js";

const withTotal = (cartItem) => ({
  ...cartItem.toJSON(),
  totalPrice: cartItem.quantity * cartItem.priceAtAddition,
});

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity, variantId } = req.body;
  const userId = req.user?.id;
  const guestId = req.guestId;

  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let variant = null;
  if (variantId) {
    variant = await ProductVariant.findOne({
      where: { id: variantId, productId },
    });
    if (!variant) throw new ApiError(404, "Product variant not found");
  }
  const unitPrice = variant ? variant.price : product.price;

  const owner = resolveOwner(userId, guestId);

  let cartItem = await CartItem.findOne({
    where: { ...owner, productId, variantId: variant ? variant.id : null },
  });

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      ...owner,
      productId,
      variantId: variant ? variant.id : null,
      quantity,
      priceAtAddition: unitPrice,
    });
  }

  res.status(201).json(new ApiResponse(201, withTotal(cartItem), "Item added to cart successfully"));
});

// Get all cart items of logged-in user or guest
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

  const owner = resolveOwner(userId, guestId);

  const cartItems = await CartItem.findAll({
    where: owner,
    include: [
      { model: Product },
      { model: ProductVariant },
      { model: User, attributes: ["id", "firstName", "email"] },
    ],
  });

  res.status(200).json(new ApiResponse(200, cartItems.map(withTotal), "Cart fetched successfully"));
});

// Update quantity of cart item
export const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user?.id;
  const guestId = req.guestId;

  const owner = resolveOwner(userId, guestId);

  const cartItem = await CartItem.findOne({ 
    where: { id, ...owner }, 
    include: [Product, ProductVariant] 
  });
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  cartItem.quantity = quantity;
  await cartItem.save();

  res.status(200).json(new ApiResponse(200, withTotal(cartItem), "Cart item updated successfully"));
});

// Remove item from cart
export const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const guestId = req.guestId;

  const owner = resolveOwner(userId, guestId);

  const cartItem = await CartItem.findOne({ where: { id, ...owner } });
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  await cartItem.destroy();

  res.status(200).json(new ApiResponse(200, {}, "Cart item removed successfully"));
});

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.guestId;

  const owner = resolveOwner(userId, guestId);

  await CartItem.destroy({ where: owner });

  res.status(200).json(new ApiResponse(200, {}, "Cart cleared successfully"));
});
