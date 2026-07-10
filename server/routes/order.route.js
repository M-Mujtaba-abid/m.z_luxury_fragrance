import express from "express"
import { createOrder, deleteOrder, getAllOrders, getOrderById, getTotalOrders, getUserOrders, updateOrderStatus } from "../controllers/orders.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const route=express.Router()


route.post("/create", isAuthenticated, createOrder);
route.get("/myorders", isAuthenticated, getUserOrders);
route.patch("/update/:id", isAuthenticated, updateOrderStatus);
route.delete("/delete/:id", isAuthenticated, deleteOrder);
route.get("/getallorderbyadmin", isAuthenticated, getAllOrders);
route.get("/gettotalorderbyadmin", isAuthenticated, getTotalOrders);
route.get("/getdetailorderbyid/:id", isAuthenticated, getOrderById);



export default route