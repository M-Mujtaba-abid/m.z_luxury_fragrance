import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import { queryOptions } from "../lib/queryOptions";

export interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscribersData {
  total: number;
  activeCount: number;
  subscribers: Subscriber[];
}

const ADMIN_KEY = ["admin", "newsletter-subscribers"];

// Public submission - no auth required, matches POST /newsletter/subscribe.
export const useSubscribeNewsletterMutation = () => {
  return useMutation<Subscriber, Error, string>({
    mutationFn: async (email: string) => {
      const response = await API.post("/newsletter/subscribe", { email });
      return response.data.data;
    },
  });
};

// --- Admin ---

// Protected by isAuthenticated + isAdmin server-side (matches GET /newsletter/admin/subscribers).
export const useAdminSubscribersQuery = () => {
  return useQuery<SubscribersData>({
    queryKey: ADMIN_KEY,
    queryFn: async () => {
      const response = await API.get("/newsletter/admin/subscribers");
      return response.data.data;
    },
    ...queryOptions.admin,
  });
};

export interface SendNewsletterPayload {
  subject: string;
  message: string;
  productIds?: number[];
}

export interface SendNewsletterResult {
  total: number;
  sentCount: number;
  failedCount: number;
  failed: string[];
}

// Matches POST /newsletter/admin/send - emails every active subscriber.
export const useSendNewsletterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SendNewsletterResult, Error, SendNewsletterPayload>({
    mutationFn: async (payload: SendNewsletterPayload) => {
      const response = await API.post("/newsletter/admin/send", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
    },
  });
};
