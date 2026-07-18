// src/redux/thunks/ReviewThunk.tsx
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../apiInstance";
import { showLoader, hideLoader } from "../slices/LoaderSlice";
import type {
  ProductReviewsResult,
  EligibleOrderItem,
  Review,
  SubmitReviewData,
} from "../types/reviewTypes";

// 🔹 Fetch paginated reviews for a product (+ average rating/breakdown)
export const fetchProductReviews = createAsyncThunk(
  "review/fetchProductReviews",
  async (
    { productId, page = 1, limit = 10 }: { productId: number; page?: number; limit?: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(showLoader());
      const response = await API.get(`/review/product/${productId}`, { params: { page, limit } });
      return response.data.data as ProductReviewsResult;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetching reviews failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Submit a new review (post-moderation — goes live immediately)
export const submitReview = createAsyncThunk(
  "review/submitReview",
  async (reviewData: SubmitReviewData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());

      const formData = new FormData();
      formData.append("orderId", reviewData.orderId.toString());
      formData.append("productId", reviewData.productId.toString());
      formData.append("rating", reviewData.rating.toString());
      if (reviewData.comment) formData.append("comment", reviewData.comment);
      reviewData.images?.forEach((file) => formData.append("images", file));

      const response = await API.post("/review/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data as Review;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Submitting review failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Delivered order-items the logged-in user hasn't reviewed yet
export const fetchEligibleOrders = createAsyncThunk(
  "review/fetchEligibleOrders",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get("/review/eligible");
      return response.data.data as EligibleOrderItem[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetching eligible orders failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Toggle helpful vote on a review
export const markReviewHelpful = createAsyncThunk(
  "review/markReviewHelpful",
  async (reviewId: number, { rejectWithValue }) => {
    try {
      const response = await API.post(`/review/helpful/${reviewId}`);
      return { reviewId, ...response.data.data } as { reviewId: number; helpful: boolean; helpfulCount: number };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Updating helpful vote failed");
    }
  }
);

// 🔹 Get all reviews (Admin)
export const adminFetchAllReviews = createAsyncThunk(
  "review/adminFetchAllReviews",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const response = await API.get("/review/admin/all");
      return response.data.data as Review[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetching reviews failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);

// 🔹 Delete a review (Admin)
export const adminDeleteReview = createAsyncThunk(
  "review/adminDeleteReview",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      await API.delete(`/review/delete/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Deleting review failed");
    } finally {
      dispatch(hideLoader());
    }
  }
);
