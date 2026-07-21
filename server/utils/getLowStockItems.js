const DEFAULT_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD) || 5;

// cartItems here are CartItem instances with Product/ProductVariant includes
// (see orders.service.js). Stock is per-variant when a variant was purchased,
// otherwise it falls back to the product's own stock count.
const getLowStockItems = (cartItems, threshold = DEFAULT_THRESHOLD) => {
  const lowStockItems = [];

  for (const item of cartItems) {
    const stock = item.ProductVariant ? item.ProductVariant.stock : item.Product?.stock;
    if (stock === undefined || stock === null || stock > threshold) continue;

    lowStockItems.push({
      name: item.Product?.title || "Item",
      size: item.ProductVariant?.size || null,
      stock,
    });
  }

  return lowStockItems;
};

export default getLowStockItems;
