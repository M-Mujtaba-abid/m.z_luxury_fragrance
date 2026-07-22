import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import type { Product } from "../redux/types/productTypes";
import { queryOptions } from "../lib/queryOptions";

// Mirrors wishlist.model.js - no association alias, so Sequelize nests the
// eager-loaded row under the model name itself ("Product", capitalized).
// wishlist.service.js selects enough Product columns to satisfy this type.
export interface WishlistItem {
  id: number;
  userId: number | null;
  guestId: string | null;
  productId: number;
  createdAt: string;
  updatedAt: string;
  Product?: Product;
}

interface WishlistListResponse {
  items: WishlistItem[];
  total: number;
}

interface ToggleWishlistResult {
  status: "added" | "removed";
  item: WishlistItem | null;
}

// --- Queries ---

export const useWishlistQuery = () => {
  return useQuery<WishlistListResponse>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await API.get("/wishlist/getallwishlist");
      return response.data.data;
    },
    ...queryOptions.wishlist,
  });
};

// --- Mutations ---

export const useToggleWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleWishlistResult, Error, number>({
    mutationFn: async (productId: number) => {
      const response = await API.post(`/wishlist/toggle/${productId}`);
      // Backend returns 201 + the created row when added, 200 + null when removed.
      const wasAdded = response.status === 201;
      return { status: wasAdded ? "added" : "removed", item: response.data.data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveFromWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (productId: number) => {
      await API.delete(`/wishlist/deletewishlistitem/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useClearWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await API.delete("/wishlist/deletewishlist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
