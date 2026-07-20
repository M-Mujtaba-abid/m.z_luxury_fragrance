import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import resolveOwner from "../utils/resolveOwner.js";

// Toggle: if the product is already wishlisted for this owner, remove it;
// otherwise add it. Caller uses the returned `status` to pick 201 vs 200.
export const toggleWishlist = async ({ userId, guestId, productId }) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const owner = resolveOwner(userId, guestId);

  const existing = await Wishlist.findOne({ where: { ...owner, productId } });

  if (existing) {
    await existing.destroy();
    return { status: "removed", item: null };
  }

  const item = await Wishlist.create({ ...owner, productId });
  return { status: "added", item };
};

export const removeFromWishlist = async ({ userId, guestId, productId }) => {
  const owner = resolveOwner(userId, guestId);

  const wishlistItem = await Wishlist.findOne({ where: { ...owner, productId } });
  if (!wishlistItem) throw new ApiError(404, "Item not found in wishlist");

  await wishlistItem.destroy();
};

export const getUserWishlist = async ({ userId, guestId }) => {
  const owner = resolveOwner(userId, guestId);

  const wishlistItems = await Wishlist.findAll({
    where: owner,
    include: [
      {
        model: Product,
        // Full enough for the storefront ProductCard component to render
        // as-is (badges, size tag, sale price) - not just an id/title stub.
        attributes: [
          "id",
          "title",
          "description",
          "status",
          "price",
          "stock",
          "productImage",
          "category",
          "Quantity",
          "isFeatured",
          "isNewArrival",
          "isOnSale",
          "discountPrice",
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return wishlistItems;
};

export const clearWishlist = async ({ userId, guestId }) => {
  const owner = resolveOwner(userId, guestId);

  await Wishlist.destroy({ where: owner });
};
