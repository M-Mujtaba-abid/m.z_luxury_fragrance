import { useCallback } from "react";
import toast from "react-hot-toast";
import {
  useCompareQuery,
  useToggleCompareMutation,
  MAX_COMPARE_ITEMS,
} from "../queries/compareQueries";

// Same shape as useWishlist.ts - a thin wrapper over the TanStack Query
// compare hooks. Works identically for logged-in users and guests.
export const useCompare = () => {
  const { data, isLoading, isError } = useCompareQuery();
  const toggleMutation = useToggleCompareMutation();

  const compareItems = data?.items ?? [];
  const totalItems = data?.total ?? 0;
  const isFull = totalItems >= MAX_COMPARE_ITEMS;

  // Derived straight from the mutation's own state, so only the product
  // actually being toggled shows a spinner.
  const loadingId = toggleMutation.isPending ? toggleMutation.variables ?? null : null;

  const isComparing = useCallback(
    (productId: number) => compareItems.some((item) => item.productId === productId),
    [compareItems]
  );

  const toggleCompare = useCallback(
    (productId: number) => {
      toggleMutation.mutate(productId, {
        onSuccess: (result) => {
          toast.success(
            result.status === "added" ? "Added to Compare list" : "Removed from Compare list",
            { icon: "🔄" }
          );
        },
        onError: (error: any) => {
          // Backend already returns a specific message for the 2-item cap
          // ("You can only compare a maximum of 2 products"), so surface it as-is.
          toast.error(error?.response?.data?.message || "Failed to update compare list");
        },
      });
    },
    [toggleMutation]
  );

  return {
    compareItems,
    totalItems,
    isFull,
    isLoading,
    isError,
    loadingId,
    isComparing,
    toggleCompare,
  };
};

export default useCompare;
