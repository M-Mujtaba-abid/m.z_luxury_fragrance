import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../redux/apiInstance";
import type { Product } from "../redux/types/productTypes";
import { queryOptions } from "../lib/queryOptions";

export const MAX_COMPARE_ITEMS = 2;

// Mirrors compare.model.js - no association alias, so Sequelize nests the
// eager-loaded row under the model name itself ("Product", capitalized).
export interface CompareItem {
  id: number;
  userId: number | null;
  guestId: string | null;
  productId: number;
  createdAt: string;
  updatedAt: string;
  Product?: Product;
}

interface CompareListResponse {
  items: CompareItem[];
  total: number;
}

interface ToggleCompareResult {
  status: "added" | "removed";
  item: CompareItem | null;
}

// --- Query ---

export const useCompareQuery = () => {
  return useQuery<CompareListResponse>({
    queryKey: ["compare"],
    queryFn: async () => {
      const response = await API.get("/compare/");
      return response.data.data;
    },
    ...queryOptions.compare,
  });
};

// --- Mutations ---

export const useToggleCompareMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ToggleCompareResult, Error, number>({
    mutationFn: async (productId: number) => {
      const response = await API.post(`/compare/toggle/${productId}`);
      // Backend returns 201 + the created row when added, 200 + null when removed.
      const wasAdded = response.status === 201;
      return { status: wasAdded ? "added" : "removed", item: response.data.data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compare"] });
    },
  });
};

export const useRemoveFromCompareMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (productId: number) => {
      await API.delete(`/compare/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compare"] });
    },
  });
};

export const useClearCompareMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await API.delete("/compare/");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compare"] });
    },
  });
};
