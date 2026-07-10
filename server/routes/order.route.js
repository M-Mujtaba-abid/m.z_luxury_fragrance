import express from "express"
import { createOrder, deleteOrder, getAllOrders, getOrderById, getTotalOrders, getUserOrders, trackOrder, updateOrderStatus } from "../controllers/orders.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { identifyUser } from "../middleware/identifyUser.js";
import { validateCreateOrder, validateUpdateOrderStatus, validateOrderId } from "../validators/orders.validator.js";
import { validateGuestCheckout, validateTrackOrder } from "../validators/guestCheckout.validator.js";

const route=express.Router()

// guest + logged-in: identifyUser never blocks, validateGuestCheckout only
// applies its extra checks when req.user is absent
route.post("/create", identifyUser, validateCreateOrder, validateGuestCheckout, createOrder);

// guest order tracking - no login needed, just order id + email
route.get("/track/:id", validateTrackOrder, trackOrder);

route.get("/myorders", isAuthenticated, getUserOrders);
route.patch("/update/:id", isAuthenticated, validateUpdateOrderStatus, updateOrderStatus);
route.delete("/delete/:id", isAuthenticated, validateOrderId, deleteOrder);
route.get("/getallorderbyadmin", isAuthenticated, getAllOrders);
route.get("/gettotalorderbyadmin", isAuthenticated, getTotalOrders);
route.get("/getdetailorderbyid/:id", isAuthenticated, validateOrderId, getOrderById);



export default route
