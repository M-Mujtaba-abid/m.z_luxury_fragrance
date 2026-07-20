import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import type {
  ProductReviewsResult,
  EligibleOrderItem,
  Review,
  SubmitReviewData,
} from "../redux/types/reviewTypes";

const STALE_TIME = 1000 * 60 * 2; // 2 mins
const GC_TIME = 1000 * 60 * 10; // 10 mins

interface HelpfulResult {
  reviewId: number;
  helpful: boolean;
  helpfulCount: number;
}

// --- Queries ---

export const useProductReviewsQuery = (productId: number, page: number = 1, limit: number = 10) => {
  return useQuery<ProductReviewsResult>({
    queryKey: ["reviews", "product", productId, page, limit],
    queryFn: async () => {
      const response = await API.get(`/review/product/${productId}`, { params: { page, limit } });
      return response.data.data;
    },
    enabled: !!productId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 1,
  });
};

// Delivered order-items the logged-in user hasn't reviewed yet — drives the
// "Write a Review" button on the order history page. `enabled` is passed in
// by the caller since eligibility only makes sense for a logged-in user.
export const useEligibleOrdersQuery = (enabled: boolean) => {
  return useQuery<EligibleOrderItem[]>({
    queryKey: ["reviews", "eligible"],
    queryFn: async () => {
      const response = await API.get("/review/eligible");
      return response.data.data;
    },
    enabled,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 1,
  });
};

export const useAdminAllReviewsQuery = () => {
  return useQuery<Review[]>({
    queryKey: ["reviews", "admin", "all"],
    queryFn: async () => {
      const response = await API.get("/review/admin/all");
      return response.data.data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 1,
  });
};

// --- Mutations ---

// Post-moderation — goes live immediately, no approval step.
export const useSubmitReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, SubmitReviewData>({
    mutationFn: async (reviewData) => {
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
    },
    onSuccess: (result) => {
      // eligible-orders no longer includes this order/product; the just-
      // submitted review's product listing needs to reflect it too.
      queryClient.invalidateQueries({ queryKey: ["reviews", "eligible"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "product", result.productId] });
    },
  });
};

export const useMarkReviewHelpfulMutation = () => {
  return useMutation<HelpfulResult, Error, number>({
    mutationFn: async (reviewId) => {
      const response = await API.post(`/review/helpful/${reviewId}`);
      return { reviewId, ...response.data.data };
    },
  });
};

export const useAdminDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await API.delete(`/review/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "admin", "all"] });
    },
  });
};
