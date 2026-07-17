import * as ordersService from "../services/orders.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create new order (with cart -> orderItems mapping) - works for both
// logged-in users and guests (identifyUser sets req.user or req.guestId)
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const guestId = req.user ? undefined : req.guestId;

  const order = await ordersService.createOrder({ ...req.body, userId, guestId });

  res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

// Guest order tracking by order id + email, no login required
export const trackOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  const order = await ordersService.getGuestOrder({ id, email });

  res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
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
