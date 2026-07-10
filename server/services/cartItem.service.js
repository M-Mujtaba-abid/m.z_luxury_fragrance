import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

const withTotal = (cartItem) => ({
  ...cartItem.toJSON(),
  totalPrice: cartItem.quantity * cartItem.priceAtAddition,
});

export const addToCart = async ({ userId, productId, quantity }) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let cartItem = await CartItem.findOne({ where: { userId, productId } });

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
      priceAtAddition: product.price,
    });
  }

  return withTotal(cartItem);
};

export const getUserCart = async ({ userId }) => {
  const cartItems = await CartItem.findAll({
    where: { userId },
    include: [{ model: Product }, { model: User, attributes: ["id", "firstName", "email"] }],
  });

  return cartItems.map(withTotal);
};

export const updateCartItem = async ({ id, userId, quantity }) => {
  const cartItem = await CartItem.findOne({ where: { id, userId }, include: [Product] });
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  cartItem.quantity = quantity;
  await cartItem.save();

  return withTotal(cartItem);
};

export const removeCartItem = async ({ id, userId }) => {
  const cartItem = await CartItem.findOne({ where: { id, userId } });
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  await cartItem.destroy();
};

export const clearCart = async ({ userId }) => {
  await CartItem.destroy({ where: { userId } });
};
