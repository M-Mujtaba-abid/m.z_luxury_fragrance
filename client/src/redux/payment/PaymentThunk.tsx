import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../redux/apiInstance";
import { showLoader, hideLoader } from "../LoaderSlice";

// 🔹 Interfaces define karna
interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutPayload {
  items: CheckoutItem[];
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry: string;
  totalAmount: number;
}

export const createCheckoutSession = createAsyncThunk(
  "payment/createCheckoutSession",
  async (payload: CheckoutPayload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());

      const response = await API.post(
        "/payment/create-checkout-session",
        payload
      );

      return response.data; // { url }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Checkout session failed"
      );
    } finally {
      dispatch(hideLoader());
    }
  }
);


// ✅ Get Checkout Session by ID
export const getCheckoutSession = createAsyncThunk(
  "payment/getCheckoutSession",
  async (sessionId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());

      const response = await API.get(`/payment/sessionsuccess/${sessionId}`);
      return response.data; // Stripe session object
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch session"
      );
    } finally {
      dispatch(hideLoader());
    }
  }
);