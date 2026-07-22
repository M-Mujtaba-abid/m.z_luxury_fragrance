import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import { queryOptions } from "../lib/queryOptions";

// --------------- Types ---------------

export interface CartProduct {
  id: number;
  title: string;
  productImage: string;
  price: number;
}

export interface CartUser {
  id: number;
  firstName: string;
  email: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  priceAtAddition: number;
  totalPrice: number;
  Product: CartProduct;
  User: CartUser;
}

// --------------- Query ---------------

export const useCartQuery = () => {
  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await API.get("/cartitem/getallcartproduct");
      return response.data.data;
    },
    ...queryOptions.cart,
  });
};

// --------------- Mutations ---------------

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CartItem, Error, { productId: number; quantity: number }>({
    mutationFn: async ({ productId, quantity }) => {
      const response = await API.post(`/cartitem/addtocart/${productId}`, { quantity });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CartItem, Error, { id: number; quantity: number }>({
    mutationFn: async ({ id, quantity }) => {
      const response = await API.patch(`/cartitem/updatecart/${id}`, { quantity });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await API.delete(`/cartitem/deletecartitem/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await API.delete("/cartitem/deletcart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
