import express from "express"
import { createOrder, deleteOrder, getAllOrders, getOrderById, getTotalOrders, getUserOrders, updateOrderStatus } from "../controllers/orders.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validateCreateOrder, validateUpdateOrderStatus, validateOrderId } from "../validators/orders.validator.js";

const route=express.Router()


route.post("/create", isAuthenticated, validateCreateOrder, createOrder);
route.get("/myorders", isAuthenticated, getUserOrders);
route.patch("/update/:id", isAuthenticated, validateUpdateOrderStatus, updateOrderStatus);
route.delete("/delete/:id", isAuthenticated, validateOrderId, deleteOrder);
route.get("/getallorderbyadmin", isAuthenticated, getAllOrders);
route.get("/gettotalorderbyadmin", isAuthenticated, getTotalOrders);
route.get("/getdetailorderbyid/:id", isAuthenticated, validateOrderId, getOrderById);



export default route