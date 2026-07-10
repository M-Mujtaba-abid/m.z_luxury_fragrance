import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import CartItem from "../models/CartItem.model.js";
import Product from "../models/product.model.js";
import orderItem from "../models/orderItem.model.js";

// Create new order (with cart → orderItems mapping)
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingStreet,
    shippingCity,
    shippingState,
    shippingPostalCode,
    shippingCountry,
    paymentMethod,
  } = req.body;

  // 1. Validate required fields
  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !shippingStreet ||
    !shippingCity ||
    !shippingCountry
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // 2. Check cart items of this user
  const cartItems = await CartItem.findAll({
    where: { userId, status: "active" },
    include: [Product],
  });

  if (cartItems.length === 0) {
    throw new ApiError(400, "Your cart is empty. Add products first.");
  }

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
  for (const item of cartItems) {
    await orderItem.create({
      orderId: order.id,
      productId: item.productId,
      productName: item.Product.title,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtAddition,
      subtotal: item.quantity * item.priceAtAddition,
    });
  }

  // 6. Clear the user's cart
  await CartItem.destroy({ where: { userId } });

  // 7. Response
  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// Get all orders of logged-in user
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "email"],
      },
      {
        model: orderItem,
        include: [
          {
            model: Product,
            attributes: ["id", "title", "productImage", "price"], // product ka detail
          },
        ],
      },
    ],
  });

  res.status(200).json({
    success: true,
    message: "User orders fetched successfully",
    data: orders,
  });
});

// Update order status (Admin use case)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findByPk(id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  await order.save();

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

// Delete an order (if needed)
export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const order = await Order.findOne({ where: { id, userId } });
  if (!order) throw new ApiError(404, "Order not found");

  await order.destroy();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Order deleted successfully"));
});


// Get all orders (Admin use case)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "email"],
      },
      {
        model: orderItem,
        include: [
          {
            model: Product,
            attributes: ["id", "title", "productImage", "price"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]], // latest orders first
  });

  res.status(200).json({
    success: true,
    message: "All user orders fetched successfully",
    data: orders,
  });
});

// Get single order details by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "email"],
      },
      {
        model: orderItem,
        include: [
          {
            model: Product,
            attributes: ["id", "title", "productImage", "price"],
          },
        ],
      },
    ],
  });

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json({
    success: true,
    message: "Order details fetched successfully",
    data: order,
  });
});

// Get total number of orders
export const getTotalOrders = asyncHandler(async (req, res) => {
  const totalOrders = await Order.count();

  res.status(200).json({
    success: true,
    message: "Total number of orders fetched successfully",
    data: { totalOrders },
  });
});
