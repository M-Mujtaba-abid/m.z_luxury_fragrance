// src/redux/OrderThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../apiInstance";
import { showLoader, hideLoader } from "../../LoaderSlice";

// 🔹 Create Order
export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.post("/order/create", orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Order creation failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Get Logged-in User Orders
export const fetchMyOrders = createAsyncThunk(
  "order/myOrders",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get("/order/myorders");
      return response.data.data; // because backend → { success, message, data: orders }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetching orders failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ id, status }: { id: number; status: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.patch(`/order/update/${id}`, { status });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Updating order failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Delete Order
export const deleteOrder = createAsyncThunk(
  "order/delete",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.delete(`/order/delete/${id}`);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Deleting order failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);


// 🔹 Get all orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get("/order/getallorderbyadmin"); // backend route
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetching all orders failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Get single order by ID at admin side
export const fetchOrderById = createAsyncThunk(
  "order/fetchById",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get(`/order/getdetailorderbyid/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetching order details failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Get total number of orders at dashboar
export const fetchTotalOrders = createAsyncThunk(
  "order/fetchTotal",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get("/order/gettotalorderbyadmin");
      return response.data.data.totalOrders;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetching total orders failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);