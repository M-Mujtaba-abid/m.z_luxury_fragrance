import * as ordersService from "../services/orders.service.js";
import ApiResponse from "../utils/apiResponse.js";
<<<<<<< HEAD
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
import orderItem from "../models/orderItem.model.js";
import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";
=======
import asyncHandler from "../utils/asyncHandler.js";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

// Create new order (with cart -> orderItems mapping) - works for both
// logged-in users and guests (identifyUser sets req.user or req.guestId)
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.user ? undefined : req.guestId;

  const order = await ordersService.createOrder({ ...req.body, userId, guestId });

  res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

<<<<<<< HEAD
  // 2. Check cart items of this user
  const cartItems = await CartItem.findAll({
    where: { userId, status: "active" },
    include: [Product, ProductVariant],
  });
=======
// Guest order tracking by order id + email, no login required
export const trackOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

  const order = await ordersService.getGuestOrder({ id, email });

<<<<<<< HEAD
  // 3. Calculate total amount dynamically
  let totalAmount = 0;
  cartItems.forEach((item) => {
    totalAmount += item.quantity * item.priceAtAddition;
  });

  // 4. Create order
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
    status: "pending", // default
  });

  // 5. Create order items (snapshot of cart)
  const createdOrderItems = [];
  for (const item of cartItems) {
    const created = await orderItem.create({
      orderId: order.id,
      productId: item.productId,
      variantId: item.variantId,
      variantSize: item.ProductVariant?.size ?? null,
      productName: item.Product.title,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtAddition,
      subtotal: item.quantity * item.priceAtAddition,
    });
    createdOrderItems.push(created);
  }

  // 6. Clear the user's cart
  await CartItem.destroy({ where: { userId } });

  // 7. Send order confirmation email (best-effort — a failed email must not fail the order)
  try {
    await sendOrderConfirmationEmail(order, createdOrderItems);
  } catch (err) {
    console.error("Order confirmation email failed:", err);
  }

  // 8. Response
  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
=======
  res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44
});

// Get all orders of logged-in user
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await ordersService.getUserOrders({ userId });

  res.status(200).json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

// Update order status (Admin use case)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await ordersService.updateOrderStatus({ id, status });

  res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});

// Delete an order (if needed)
export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await ordersService.deleteOrder({ id, userId });

  res.status(200).json(new ApiResponse(200, {}, "Order deleted successfully"));
});

// Get all orders (Admin use case)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await ordersService.getAllOrders();

  res.status(200).json(new ApiResponse(200, orders, "All user orders fetched successfully"));
});

// Get single order details by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await ordersService.getOrderById({ id });

  res.status(200).json(new ApiResponse(200, order, "Order details fetched successfully"));
});

// Get total number of orders
export const getTotalOrders = asyncHandler(async (req, res) => {
  const totalOrders = await ordersService.getTotalOrders();

  res
    .status(200)
    .json(new ApiResponse(200, { totalOrders }, "Total number of orders fetched successfully"));
});
