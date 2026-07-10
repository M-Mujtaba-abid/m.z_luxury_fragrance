import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import uploadBufferToCloudinary from "../utils/cloudinaryUpload.js";
import { Op, where, col, cast } from "sequelize";

const ALLOWED_CATEGORIES = ["Men", "Women", "Children"];

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
  file,
}) => {
  const uploadedImage = await uploadBufferToCloudinary(file.buffer, "products");

  return Product.create({
    title,
    description,
    status,
    price,
    stock,
    category,
    Quantity,
    productImage: uploadedImage.secure_url,
    isFeatured,
    isNewArrival,
    isOnSale,
    discountPrice,
  });
};

export const getAllProducts = async () => Product.findAll();

export const getProductById = async ({ id }) => {
  const product = await Product.findByPk(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const updateProduct = async ({
  id,
  file,
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
}) => {
  const product = await Product.findByPk(id);
  if (!product) throw new ApiError(404, "Product not found");

  let productImage = product.productImage;
  if (file) {
    const uploadedImage = await uploadBufferToCloudinary(file.buffer, "products");
    productImage = uploadedImage.secure_url;
  }

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
  });

  return product;
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

  const products = await Product.findAll({ where: { category: matchedCategory } });
  if (products.length === 0) throw new ApiError(404, "No products found in this category");

  return products;
};

export const getNumberOfTotalproduct = async () => Product.count();

export const getFeaturedProducts = async () => Product.findAll({ where: { isFeatured: true } });

export const getNewArrivals = async () => Product.findAll({ where: { isNewArrival: true } });

export const getOnSaleProducts = async () => Product.findAll({ where: { isOnSale: true } });
