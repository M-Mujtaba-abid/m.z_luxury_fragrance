// `items` can be either CartItem instances (COD flow, with Product/ProductVariant
// includes) or plain { name, price, quantity } objects (Stripe flow, decoded from
// checkout session metadata) - normalize both shapes to what email templates need.
export const normalizeOrderItem = (item) => {
  const isCartItem = Boolean(item.Product);

  const name = isCartItem
    ? item.Product?.title || item.productName || "Item"
    : item.name || item.productName || "Item";
  const size = isCartItem ? item.ProductVariant?.size || null : item.size || null;
  const quantity = item.quantity || 1;
  const unitPrice = isCartItem
    ? item.priceAtAddition ?? item.ProductVariant?.price ?? item.Product?.price ?? 0
    : item.price ?? 0;

  return { name, size, quantity, subtotal: `PKR ${(unitPrice * quantity).toFixed(0)}` };
};

export const formatItemsListText = (normalizedItems) => {
  if (!normalizedItems.length) return "";
  return normalizedItems
    .map((item) => `- ${item.name}${item.size ? ` (${item.size})` : ""} x${item.quantity}`)
    .join("\n");
};
