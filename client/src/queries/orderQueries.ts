import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import { queryOptions } from "../lib/queryOptions";

// --------------- Queries ---------------

// Logged-in user's own orders.
export const useMyOrdersQuery = (enabled: boolean) => {
  return useQuery<any[]>({
    queryKey: ["orders", "mine"],
    queryFn: async () => {
      const response = await API.get("/order/myorders");
      return response.data.data;
    },
    enabled,
    ...queryOptions.orders,
  });
};

// Admin — all orders.
export const useAllOrdersQuery = () => {
  return useQuery<any[]>({
    queryKey: ["orders", "admin", "all"],
    queryFn: async () => {
      const response = await API.get("/order/getallorderbyadmin");
      return response.data.data;
    },
    ...queryOptions.admin,
  });
};

// Admin — single order by id.
export const useOrderByIdQuery = (id: number | undefined) => {
  return useQuery<any>({
    queryKey: ["orders", "detail", id],
    queryFn: async () => {
      const response = await API.get(`/order/getdetailorderbyid/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    ...queryOptions.orders,
  });
};

// Admin — total order count for dashboard KPI.
export const useTotalOrdersQuery = () => {
  return useQuery<number>({
    queryKey: ["orders", "admin", "total"],
    queryFn: async () => {
      const response = await API.get("/order/gettotalorderbyadmin");
      return response.data.data.totalOrders;
    },
    ...queryOptions.admin,
  });
};

// Guest order tracking — requires orderId + email, no login needed.
// Returns a single order object or null when not yet queried.
export const useTrackGuestOrderQuery = (
  params: { id: string | number; email: string } | null
) => {
  return useQuery<any>({
    queryKey: ["orders", "track", params?.id, params?.email],
    queryFn: async () => {
      const response = await API.get(`/order/track/${params!.id}`, {
        params: { email: params!.email },
      });
      return response.data.data;
    },
    enabled: !!params?.id && !!params?.email,
    ...queryOptions.orders,
    staleTime: 0, // always fresh — guest may check their status mid-delivery
    retry: 0, // a wrong ID/email gives 404 — don't retry
  });
};

// --------------- Mutations ---------------

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (orderData) => {
      const response = await API.post("/order/create", orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "mine"] });
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: number; status: string }>({
    mutationFn: async ({ id, status }) => {
      const response = await API.patch(`/order/update/${id}`, { status });
      return response.data;
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", "admin", "all"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "detail", variables.id] });
    },
  });
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await API.delete(`/order/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "admin", "all"] });
    },
  });
};
