import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../redux/apiInstance";

const GC_TIME = 1000 * 60 * 10; // 10 mins

// --------------- Types ---------------

export interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
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

// --------------- Mutations ---------------

// Creates a Stripe checkout session; returns { url } to redirect to.
export const useCreateCheckoutSessionMutation = () => {
  return useMutation<{ url: string }, Error, CheckoutPayload>({
    mutationFn: async (payload) => {
      const response = await API.post("/payment/create-checkout-session", payload);
      return response.data; // { url }
    },
  });
};

// --------------- Queries ---------------

// Fetches a Stripe session object by sessionId (used on the Success page).
// `enabled` lets the caller gate the fetch on the presence of a session_id param.
export const useCheckoutSessionQuery = (sessionId: string | null) => {
  return useQuery<any>({
    queryKey: ["payment", "session", sessionId],
    queryFn: async () => {
      const response = await API.get(`/payment/sessionsuccess/${sessionId}`);
      return response.data; // Stripe session object
    },
    enabled: !!sessionId,
    gcTime: GC_TIME,
    retry: 1,
    // Sessions are immutable once created — never stale.
    staleTime: Infinity,
  });
};
