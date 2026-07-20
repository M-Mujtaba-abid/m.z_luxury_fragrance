import Compare from "../models/compare.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import resolveOwner from "../utils/resolveOwner.js";

const MAX_COMPARE_ITEMS = 2;
const productAttributes = ["id", "title", "price", "productImage", "stock"];

// Toggle: if the product is already in the compare list, remove it.
// Otherwise add it, unless the owner has already hit the 2-item cap.
export const toggleCompare = async ({ userId, guestId, productId }) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const owner = resolveOwner(userId, guestId);

  const existing = await Compare.findOne({ where: { ...owner, productId } });

  if (existing) {
    await existing.destroy();
    return { status: "removed", item: null };
  }

  const currentCount = await Compare.count({ where: owner });
  if (currentCount >= MAX_COMPARE_ITEMS) {
    throw new ApiError(400, `You can only compare a maximum of ${MAX_COMPARE_ITEMS} products`);
  }

  const created = await Compare.create({ ...owner, productId });
  const item = await Compare.findByPk(created.id, {
    include: [{ model: Product, attributes: productAttributes }],
  });

  return { status: "added", item };
};

export const getUserCompareList = async ({ userId, guestId }) => {
  const owner = resolveOwner(userId, guestId);

  const compareItems = await Compare.findAll({
    where: owner,
    include: [{ model: Product, attributes: productAttributes }],
    order: [["createdAt", "DESC"]],
  });

  return compareItems;
};

export const removeFromCompare = async ({ userId, guestId, productId }) => {
  const owner = resolveOwner(userId, guestId);

  const compareItem = await Compare.findOne({ where: { ...owner, productId } });
  if (!compareItem) throw new ApiError(404, "Item not found in compare list");

  await compareItem.destroy();
};

export const clearCompareList = async ({ userId, guestId }) => {
  const owner = resolveOwner(userId, guestId);

  await Compare.destroy({ where: owner });
};
