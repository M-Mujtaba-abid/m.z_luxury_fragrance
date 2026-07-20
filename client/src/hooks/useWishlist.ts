import { useCallback } from "react";
import toast from "react-hot-toast";
import {
  useWishlistQuery,
  useToggleWishlistMutation,
} from "../queries/wishlistQueries";

// Thin ergonomic wrapper around the TanStack Query wishlist hooks. Works
// identically for logged-in users and guests - the backend resolves the
// owner from the session cookie, this hook never has to know which one it is.
export const useWishlist = () => {
  const { data, isLoading, isError } = useWishlistQuery();
  const toggleMutation = useToggleWishlistMutation();

  const wishlistItems = data?.items ?? [];
  const totalItems = data?.total ?? 0;

  // Derived straight from the mutation's own state, so only the product
  // actually being toggled shows a spinner - no separate state to desync.
  const loadingId = toggleMutation.isPending ? toggleMutation.variables ?? null : null;

  const isFavorite = useCallback(
    (productId: number) => wishlistItems.some((item) => item.productId === productId),
    [wishlistItems]
  );

  const toggleWishlist = useCallback(
    (productId: number) => {
      toggleMutation.mutate(productId, {
        onSuccess: (result) => {
          toast.success(
            result.status === "added" ? "Added to Wishlist" : "Removed from Wishlist",
            { icon: "❤️" }
          );
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update wishlist");
        },
      });
    },
    [toggleMutation]
  );

  return {
    wishlistItems,
    totalItems,
    isLoading,
    isError,
    loadingId,
    isFavorite,
    toggleWishlist,
  };
};

export default useWishlist;
