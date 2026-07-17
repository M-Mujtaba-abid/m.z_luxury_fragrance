import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import resolveOwner from "../utils/resolveOwner.js";

const withTotal = (cartItem) => ({
  ...cartItem.toJSON(),
  totalPrice: cartItem.quantity * cartItem.priceAtAddition,
});

export const addToCart = async ({ userId, guestId, productId, quantity, variantId }) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let variant = null;
  if (variantId) {
    variant = await ProductVariant.findOne({ where: { id: variantId, productId } });
    if (!variant) throw new ApiError(404, "Product variant not found");
  }
  const unitPrice = variant ? variant.price : product.price;

  const owner = resolveOwner(userId, guestId);

  // Same product but a different variant is a distinct cart line.
  let cartItem = await CartItem.findOne({
    where: { ...owner, productId, variantId: variant ? variant.id : null },
  });

  if (cartItem) {
    // update quantity only, priceAtAddition same rahega
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    // create new cart item with snapshot price
    cartItem = await CartItem.create({
      ...owner,
      productId,
      variantId: variant ? variant.id : null,
      quantity,
      priceAtAddition: unitPrice,
    });
  }

  return withTotal(cartItem);
};

export const getUserCart = async ({ userId, guestId }) => {
  const owner = resolveOwner(userId, guestId);

  const cartItems = await CartItem.findAll({
    where: owner,
    include: [
      { model: Product },
      { model: ProductVariant },
      { model: User, attributes: ["id", "firstName", "email"] },
    ],
  });

  return cartItems.map(withTotal);
};

export const updateCartItem = async ({ id, userId, guestId, quantity }) => {
  const owner = resolveOwner(userId, guestId);

  const cartItem = await CartItem.findOne({
    where: { id, ...owner },
    include: [Product, ProductVariant],
  });
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  cartItem.quantity = quantity;
  await cartItem.save();

  return withTotal(cartItem);
};

export const removeCartItem = async ({ id, userId, guestId }) => {
  const owner = resolveOwner(userId, guestId);

  const cartItem = await CartItem.findOne({ where: { id, ...owner } });
  if (!cartItem) throw new ApiError(404, "Cart item not found");

  await cartItem.destroy();
};

export const clearCart = async ({ userId, guestId }) => {
  const owner = resolveOwner(userId, guestId);

  await CartItem.destroy({ where: owner });
};
