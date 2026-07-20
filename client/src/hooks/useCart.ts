/**
 * useCart – thin ergonomic wrapper around cartQueries.ts.
 *
 * Provides the cart item list, total, and all mutation helpers in one hook.
 * Components can import this instead of importing every query/mutation separately.
 */
import { useQueryClient } from "@tanstack/react-query";
import {
  useCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  type CartItem,
} from "../queries/cartQueries";

export const useCart = () => {
  const queryClient = useQueryClient();

  const cartQuery = useCartQuery();
  const cartItems: CartItem[] = cartQuery.data ?? [];

  const addToCart = useAddToCartMutation();
  const updateItem = useUpdateCartItemMutation();
  const removeItem = useRemoveCartItemMutation();
  const clearCart = useClearCartMutation();

  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Optimistic quantity update — immediately reflects in the UI, rolls back on error.
  const updateQuantityOptimistic = async (id: number, quantity: number) => {
    if (quantity < 1) return;

    // 1. Cancel any in-flight refetch that would overwrite the optimistic data.
    await queryClient.cancelQueries({ queryKey: ["cart"] });

    // 2. Snapshot current data for rollback.
    const previous = queryClient.getQueryData<CartItem[]>(["cart"]);

    // 3. Apply optimistic update.
    queryClient.setQueryData<CartItem[]>(["cart"], (old) =>
      (old ?? []).map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    try {
      await updateItem.mutateAsync({ id, quantity });
    } catch {
      // 4. Roll back on failure.
      queryClient.setQueryData(["cart"], previous);
    }
  };

  return {
    cartItems,
    total,
    isLoading: cartQuery.isLoading,
    error: cartQuery.error?.message ?? null,

    // Helpers
    addToCart: (productId: number, quantity = 1) =>
      addToCart.mutateAsync({ productId, quantity }),
    updateQuantity: updateQuantityOptimistic,
    removeItem: (id: number) => removeItem.mutateAsync(id),
    clearCart: () => clearCart.mutateAsync(),

    // Per-mutation pending states (for granular button disabling)
    isAdding: addToCart.isPending,
    isRemoving: removeItem.isPending,
    isClearing: clearCart.isPending,
  };
};
