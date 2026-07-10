import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../apiInstance";
import { showLoader, hideLoader } from "../../LoaderSlice";

// ✅ Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: number; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(showLoader()); // Loader ON
      const response = await API.post(`/cartitem/addtocart/${productId}`, {
        quantity,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
    } finally {
      dispatch(hideLoader()); // Loader OFF
    }
  }
);

// ✅ Get all cart items
export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get("/cartitem/getallcartproduct");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// ✅ Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { id, quantity }: { id: number; quantity: number },
    {  rejectWithValue }
  ) => {
    try {
      // dispatch(showLoader());
      const response = await API.patch(`/cartitem/updatecart/${id}`, {
        quantity,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update cart item");
    } finally {
      // dispatch(hideLoader());
    }
  }
);

// ✅ Remove cart item
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      await API.delete(`/cartitem/deletecartitem/${id}`);
      return id; // return ID to remove from state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove cart item");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// ✅ Clear all cart items
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      await API.delete("/cartitem/deletcart");
      return {};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    } finally {
      dispatch(hideLoader());
    }
  }
);
