import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import OrderItem from "../models/orderItem.model.js";
import ApiError from "../utils/apiError.js";

const orderIncludes = [
  { model: User, attributes: ["id", "firstName", "email"] },
  {
    model: OrderItem,
    include: [{ model: Product, attributes: ["id", "title", "productImage", "price"] }],
  },
];

// Create new order (with cart -> orderItems mapping)
export const createOrder = async ({
  userId,
  customerName,
  customerEmail,
  customerPhone,
  shippingStreet,
  shippingCity,
  shippingState,
  shippingPostalCode,
  shippingCountry,
  paymentMethod,
}) => {
  const cartItems = await CartItem.findAll({
    where: { userId, status: "active" },
    include: [Product],
  });

  if (cartItems.length === 0) {
    throw new ApiError(400, "Your cart is empty. Add products first.");
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.priceAtAddition,
    0
  );

  const order = await Order.create({
    userId,
    customerName,
    customerEmail,
    customerPhone,
    shippingStreet,
    shippingCity,
    shippingState,
    shippingPostalCode,
    shippingCountry,
    totalAmount,
    paymentMethod,
    status: "pending",
  });

  // snapshot of cart -> order items
  for (const item of cartItems) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      productName: item.Product.title,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtAddition,
      subtotal: item.quantity * item.priceAtAddition,
    });
  }

  await CartItem.destroy({ where: { userId } });

  return order;
};

export const getUserOrders = async ({ userId }) => {
  return Order.findAll({ where: { userId }, include: orderIncludes });
};

export const updateOrderStatus = async ({ id, status }) => {
  const order = await Order.findByPk(id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  await order.save();

  return order;
};

export const deleteOrder = async ({ id, userId }) => {
  const order = await Order.findOne({ where: { id, userId } });
  if (!order) throw new ApiError(404, "Order not found");

  await order.destroy();
};

export const getAllOrders = async () => {
  return Order.findAll({ include: orderIncludes, order: [["createdAt", "DESC"]] });
};

export const getOrderById = async ({ id }) => {
  const order = await Order.findByPk(id, { include: orderIncludes });
  if (!order) throw new ApiError(404, "Order not found");
  return order;
};

export const getTotalOrders = async () => {
  return Order.count();
};
