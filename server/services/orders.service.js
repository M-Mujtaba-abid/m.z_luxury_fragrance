import { Op } from "sequelize";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
import OrderItem from "../models/orderItem.model.js";
import ApiError from "../utils/apiError.js";
import resolveOwner from "../utils/resolveOwner.js";
import sendOrderConfirmationEmail from "../utils/sendOrderConfirmationEmail.js";
import sendOrderStatusUpdateEmail from "../utils/sendOrderStatusUpdateEmail.js";
import sendOrderCancellationEmail from "../utils/sendOrderCancellationEmail.js";
import sendAdminNewOrderEmail from "../utils/sendAdminNewOrderEmail.js";
import sendLowStockAlertEmail from "../utils/sendLowStockAlertEmail.js";
import getLowStockItems from "../utils/getLowStockItems.js";

const orderIncludes = [
  { model: User, attributes: ["id", "firstName", "email"] },
  {
    model: OrderItem,
    include: [
      { model: Product, attributes: ["id", "title", "productImage", "price"] },
      { model: ProductVariant, attributes: ["id", "size", "price"] }
    ],
  },
];

// Create new order (with cart -> orderItems mapping)
export const createOrder = async ({
  userId,
  guestId,
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
  const owner = resolveOwner(userId, guestId);

  const cartItems = await CartItem.findAll({
    where: { ...owner, status: "active" },
    include: [Product, ProductVariant],
  });

  if (cartItems.length === 0) {
    throw new ApiError(400, "Your cart is empty. Add products first.");
  }

  // Reject upfront rather than partially decrementing stock below - a stale
  // cart (or a race with another order) can leave less stock than requested.
  for (const item of cartItems) {
    const availableStock = item.ProductVariant ? item.ProductVariant.stock : item.Product.stock;
    if (availableStock < item.quantity) {
      const label = item.ProductVariant
        ? `${item.Product.title} (${item.ProductVariant.size})`
        : item.Product.title;
      throw new ApiError(400, `Insufficient stock for ${label}. Only ${availableStock} left.`);
    }
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.priceAtAddition,
    0
  );

  const order = await Order.create({
    userId: userId || null,
    guestId: userId ? null : guestId,
    guestEmail: userId ? null : customerEmail,
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

  // snapshot of cart -> order items, and decrement stock for what was bought.
  // Mutating item.Product/item.ProductVariant in place (rather than a
  // separate query) means the low-stock check further down sees post-order
  // stock levels for free.
  for (const item of cartItems) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      variantId: item.variantId,
      variantSize: item.ProductVariant?.size ?? null,
      productName: item.Product.title,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtAddition,
      subtotal: item.quantity * item.priceAtAddition,
    });

    if (item.ProductVariant) {
      item.ProductVariant.stock -= item.quantity;
      await item.ProductVariant.save();
    } else {
      item.Product.stock -= item.quantity;
      await item.Product.save();
    }
  }

  await CartItem.destroy({ where: owner });

  try {
    await sendOrderConfirmationEmail({ order, items: cartItems });
  } catch (error) {
    // order is already placed successfully - a failed email shouldn't fail the request
    console.error("Failed to send order confirmation email:", error);
  }

  try {
    await sendAdminNewOrderEmail({ order, items: cartItems });
  } catch (error) {
    console.error("Failed to send admin new-order email:", error);
  }

  try {
    const lowStockItems = getLowStockItems(cartItems);
    if (lowStockItems.length) {
      await sendLowStockAlertEmail({ lowStockItems });
    }
  } catch (error) {
    console.error("Failed to send low-stock alert email:", error);
  }

  return order;
};

export const getUserOrders = async ({ userId }) => {
  return Order.findAll({ where: { userId }, include: orderIncludes });
};

// Guest order tracking: Order ID + email, no login required.
// Restricted to userId: null so a guest can't use this to snoop on a
// registered customer's order just by guessing their email.
export const getGuestOrder = async ({ id, email }) => {
  const order = await Order.findOne({
    where: {
      id,
      [Op.or]: [{ guestEmail: email }, { customerEmail: email }],
    },
    include: orderIncludes,
  });

  if (!order) throw new ApiError(404, "Order not found");
  return order;
};

export const updateOrderStatus = async ({ id, status }) => {
  const order = await Order.findByPk(id);
  if (!order) throw new ApiError(404, "Order not found");

  const previousStatus = order.status;
  order.status = status;
  await order.save();

  // Only notify on an actual transition - re-saving the same status
  // shouldn't re-send an email.
  if (previousStatus !== status) {
    try {
      if (status === "cancelled") {
        await sendOrderCancellationEmail({ order });
      } else {
        await sendOrderStatusUpdateEmail({ order, status });
      }
    } catch (error) {
      // status is already saved - a failed email shouldn't fail the request
      console.error("Failed to send order status email:", error);
    }
  }

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
