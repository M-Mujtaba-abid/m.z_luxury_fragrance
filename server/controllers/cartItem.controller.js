import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const {  quantity } = req.body;
  const { productId } = req.params;

  const userId = req.user.id; // assume user is logged in (from auth middleware)
console.log(`user id ye he ${userId}  and product id ye he  ${productId} or quanitty ye h e${quantity}`)
  // check product exists

  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, "Product not found");
 
  // check if already in cart
  let cartItem = await CartItem.findOne({
    where: { userId, productId },
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
      quantity,
      priceAtAddition: product.price, // snapshot store
    });
  }

  // calculate total dynamically
  const totalPrice = cartItem.quantity * cartItem.priceAtAddition;

  res.status(201).json(
    new ApiResponse(201, { ...cartItem.toJSON(), totalPrice }, "Item added to cart successfully")
  );
});

// Get all cart items of logged-in user
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await CartItem.findAll({
    where: { userId },
    include: [{ model: Product }, { model: User, attributes: ["id", "firstName", "email"] }],
  });

  // attach totalPrice for each item
  const cartWithTotals = cartItems.map(item => ({
    ...item.toJSON(),
    totalPrice: item.quantity * item.priceAtAddition,
  }));

  res.status(200).json(new ApiResponse(200, cartWithTotals, "Cart fetched successfully"));
});

// Update quantity of cart item
export const updateCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  let cartItem = await CartItem.findOne({ where: { id, userId }, include: [Product] });
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  cartItem.quantity = quantity;
  await cartItem.save();

  const totalPrice = quantity * cartItem.priceAtAddition;

  res.status(200).json(
    new ApiResponse(200, { ...cartItem.toJSON(), totalPrice }, "Cart item updated successfully")
  );
});

// Remove cart item
export const removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const cartItem = await CartItem.findOne({ where: { id, userId } });
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  await cartItem.destroy();

  res.status(200).json(new ApiResponse(200, {}, "Cart item removed successfully"));
});

// Clear all cart items
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await CartItem.destroy({ where: { userId } });

  res.status(200).json(new ApiResponse(200, {}, "Cart cleared successfully"));
});
