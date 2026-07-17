import Product from "../models/product.model.js";
import ProductImage from "../models/productImage.model.js";
import ProductVariant from "../models/productVariant.model.js";
import ApiError from "../utils/apiError.js";
import uploadBufferToCloudinary from "../utils/cloudinaryUpload.js";
import slugify from "../utils/slugify.js";
import { Op, where, col, cast } from "sequelize";

const ALLOWED_CATEGORIES = ["Men", "Women", "Children"];

const listIncludes = [
  { model: ProductImage, separate: true, order: [["sortOrder", "ASC"]] },
  { model: ProductVariant },
];

// Tag-input fields (notes) arrive from multipart form data as either a real
// array (repeated field name), a JSON-stringified array, or a plain string.
const parseArrayField = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON — fall through to comma-split
  }
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

// `variants` arrives as a JSON string: [{ size, price, stock, sku }, ...]
const parseVariants = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error("not an array");
    return parsed;
  } catch {
    throw new ApiError(400, "variants must be a JSON array of { size, price, stock, sku }");
  }
};

const generateUniqueSlug = async (title, excludeId) => {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  // Small catalog — a loop is simpler and clear enough here than a single
  // clever query.
  while (
    await Product.findOne({
      where: { slug: candidate, ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}) },
    })
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
};

// `files` is req.files from multer .fields([{ name: "productImage" }, { name: "images" }]):
// - `images`: new multi-image gallery upload (preferred)
// - `productImage`: legacy single-file field, still supported for the current admin form
const resolveUploadImages = (files) => {
  if (files?.images?.length) return files.images;
  if (files?.productImage?.length) return files.productImage;
  return [];
};

export const createProduct = async ({
  title,
  description,
  status,
  price,
  stock,
  category,
  Quantity,
  isFeatured,
  isNewArrival,
  isOnSale,
  discountPrice,
  brand,
  gender,
  topNotes,
  heartNotes,
  baseNotes,
  metaTitle,
  metaDescription,
  slug,
  publishStatus,
  variants,
  coverIndex,
  files,
}) => {
  const imagesToUpload = resolveUploadImages(files);
  if (imagesToUpload.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  const uploaded = await Promise.all(
    imagesToUpload.map((f) => uploadBufferToCloudinary(f.buffer, "products"))
  );

  const coverIdx = Number.isInteger(Number(coverIndex)) ? Number(coverIndex) : 0;
  const cover = uploaded[coverIdx] || uploaded[0];

  const finalSlug = slug ? await generateUniqueSlug(slug) : await generateUniqueSlug(title);
  const parsedVariants = parseVariants(variants);

  const product = await Product.create({
    title,
    description,
    status,
    price,
    stock,
    category,
    Quantity,
    productImage: cover.secure_url,
    isFeatured,
    isNewArrival,
    isOnSale,
    discountPrice,
    brand,
    gender,
    topNotes: parseArrayField(topNotes),
    heartNotes: parseArrayField(heartNotes),
    baseNotes: parseArrayField(baseNotes),
    metaTitle,
    metaDescription,
    slug: finalSlug,
    publishStatus,
  });

  await ProductImage.bulkCreate(
    uploaded.map((img, index) => ({
      productId: product.id,
      imageUrl: img.secure_url,
      sortOrder: index,
      isCover: index === coverIdx,
    }))
  );

  if (parsedVariants?.length) {
    await ProductVariant.bulkCreate(
      parsedVariants.map((v) => ({
        productId: product.id,
        size: v.size,
        price: v.price,
        stock: v.stock ?? 0,
        sku: v.sku || null,
      }))
    );
  }

  return getProductById({ id: product.id });
};

export const getAllProducts = async () => Product.findAll({ include: listIncludes });

export const getProductById = async ({ id }) => {
  const product = await Product.findByPk(id, { include: listIncludes });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const updateProduct = async ({
  id,
  files,
  title,
  description,
  status,
  price,
  stock,
  category,
  Quantity,
  isFeatured,
  isNewArrival,
  isOnSale,
  discountPrice,
  brand,
  gender,
  topNotes,
  heartNotes,
  baseNotes,
  metaTitle,
  metaDescription,
  slug,
  publishStatus,
  variants,
  coverIndex,
}) => {
  const product = await Product.findByPk(id);
  if (!product) throw new ApiError(404, "Product not found");

  const imagesToUpload = resolveUploadImages(files);

  let productImage = product.productImage;
  if (imagesToUpload.length > 0) {
    const uploaded = await Promise.all(
      imagesToUpload.map((f) => uploadBufferToCloudinary(f.buffer, "products"))
    );
    const coverIdx = Number.isInteger(Number(coverIndex)) ? Number(coverIndex) : 0;
    productImage = (uploaded[coverIdx] || uploaded[0]).secure_url;

    // Re-uploading images replaces the gallery outright — simpler than
    // diffing against the previous set, and matches how a single-image edit
    // already worked before variants/gallery existed.
    await ProductImage.destroy({ where: { productId: id } });
    await ProductImage.bulkCreate(
      uploaded.map((img, index) => ({
        productId: id,
        imageUrl: img.secure_url,
        sortOrder: index,
        isCover: index === coverIdx,
      }))
    );
  }

  const resolvedSlug = slug ? await generateUniqueSlug(slug, id) : undefined;

  await product.update({
    title,
    description,
    status,
    price,
    stock,
    category,
    Quantity,
    productImage,
    isFeatured,
    isNewArrival,
    isOnSale,
    discountPrice,
    brand,
    gender,
    topNotes: parseArrayField(topNotes),
    heartNotes: parseArrayField(heartNotes),
    baseNotes: parseArrayField(baseNotes),
    metaTitle,
    metaDescription,
    ...(resolvedSlug ? { slug: resolvedSlug } : {}),
    publishStatus,
  });

  const parsedVariants = parseVariants(variants);
  if (parsedVariants) {
    // Same replace-outright approach as the image gallery above.
    await ProductVariant.destroy({ where: { productId: id } });
    if (parsedVariants.length) {
      await ProductVariant.bulkCreate(
        parsedVariants.map((v) => ({
          productId: id,
          size: v.size,
          price: v.price,
          stock: v.stock ?? 0,
          sku: v.sku || null,
        }))
      );
    }
  }

  return getProductById({ id });
};

export const deleteProduct = async ({ id }) => {
  const product = await Product.findByPk(id);
  if (!product) throw new ApiError(404, "Product not found");

  await product.destroy();
};

export const searchProducts = async ({ query }) => {
  const term = `%${query.toLowerCase()}%`;

  const products = await Product.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: term } },
        { description: { [Op.iLike]: term } },
        where(cast(col("category"), "TEXT"), { [Op.iLike]: term }),
      ],
    },
    include: listIncludes,
  });

  if (!products.length) throw new ApiError(404, "No products found");

  return products;
};

export const getProductsByCategory = async ({ category }) => {
  const matchedCategory = ALLOWED_CATEGORIES.find(
    (allowed) => allowed.toLowerCase() === category.toLowerCase()
  );
  if (!matchedCategory) {
    throw new ApiError(400, "Invalid category");
  }

  const products = await Product.findAll({
    where: { category: matchedCategory },
    include: listIncludes,
  });
  if (products.length === 0) throw new ApiError(404, "No products found in this category");

  return products;
};

export const getNumberOfTotalproduct = async () => Product.count();

export const getFeaturedProducts = async () =>
  Product.findAll({ where: { isFeatured: true }, include: listIncludes });

export const getNewArrivals = async () =>
  Product.findAll({ where: { isNewArrival: true }, include: listIncludes });

export const getOnSaleProducts = async () =>
  Product.findAll({ where: { isOnSale: true }, include: listIncludes });
