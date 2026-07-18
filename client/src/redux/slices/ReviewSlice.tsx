// src/redux/slices/ReviewSlice.tsx
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProductReviews,
  submitReview,
  fetchEligibleOrders,
  markReviewHelpful,
  adminFetchAllReviews,
  adminDeleteReview,
} from "../thunks/ReviewThunk";
import type { ProductReviewsResult, EligibleOrderItem, Review } from "../types/reviewTypes";

interface ReviewState {
  productReviews: ProductReviewsResult | null;
  eligibleOrders: EligibleOrderItem[];
  adminReviews: Review[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ReviewState = {
  productReviews: null,
  eligibleOrders: [],
  adminReviews: [],
  loading: false,
  error: null,
  success: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearReviewSuccess: (state) => {
      state.success = null;
    },
    clearProductReviews: (state) => {
      state.productReviews = null;
    },
  },
  extraReducers: (builder) => {
    // ========================
    // 🔹 Fetch Product Reviews
    // ========================
    builder.addCase(fetchProductReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.productReviews = action.payload;
    });
    builder.addCase(fetchProductReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Submit Review
    // ========================
    builder.addCase(submitReview.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(submitReview.fulfilled, (state, action) => {
      state.loading = false;
      state.success = "Review submitted successfully";
      state.eligibleOrders = state.eligibleOrders.filter(
        (e) => !(e.orderId === action.payload.orderId && e.productId === action.payload.productId)
      );
    });
    builder.addCase(submitReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Fetch Eligible Orders
    // ========================
    builder.addCase(fetchEligibleOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEligibleOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.eligibleOrders = action.payload;
    });
    builder.addCase(fetchEligibleOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Mark Review Helpful
    // ========================
    builder.addCase(markReviewHelpful.fulfilled, (state, action) => {
      if (state.productReviews) {
        state.productReviews.reviews = state.productReviews.reviews.map((r) =>
          r.id === action.payload.reviewId ? { ...r, helpfulCount: action.payload.helpfulCount } : r
        );
      }
    });
    builder.addCase(markReviewHelpful.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Admin: Fetch All Reviews
    // ========================
    builder.addCase(adminFetchAllReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(adminFetchAllReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.adminReviews = action.payload;
    });
    builder.addCase(adminFetchAllReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // 🔹 Admin: Delete Review
    // ========================
    builder.addCase(adminDeleteReview.fulfilled, (state, action) => {
      state.adminReviews = state.adminReviews.filter((r) => r.id !== action.payload);
      state.success = "Review deleted successfully";
    });
    builder.addCase(adminDeleteReview.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearReviewError, clearReviewSuccess, clearProductReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
