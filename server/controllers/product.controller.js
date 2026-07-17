// server/controllers/product.controller.js
import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
import * as productService from "../services/product.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Op } from "sequelize";

// Multipart forms can't send a nested array, so the frontend sends `variants`
// as a JSON string and we parse it here. Absent/invalid input is treated as "no variants".
const parseVariants = (rawVariants) => {
  if (!rawVariants) return [];
  try {
    const parsed = typeof rawVariants === "string" ? JSON.parse(rawVariants) : rawVariants;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// CREATE Product
export const createProduct = asyncHandler(async (req, res, next) => {
  const {
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
    variants,
  } = req.body;

  if (
    !title ||
    !description ||
    !status ||
    !price ||
    !stock ||
    !req.file ||
    !Quantity ||
    !category
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Create standard product model and upload image via service
  const newProduct = await productService.createProduct({
    title,
    description,
    status,
    price,
    stock,
    category,
    Quantity,
    isFeatured: isFeatured === "true" || isFeatured === true,
    isNewArrival: isNewArrival === "true" || isNewArrival === true,
    isOnSale: isOnSale === "true" || isOnSale === true,
    discountPrice,
    file: req.file,
  });

  const parsedVariants = parseVariants(variants);
  if (parsedVariants.length > 0) {
    await ProductVariant.bulkCreate(
      parsedVariants.map((v) => ({
        productId: newProduct.id,
        size: v.size,
        price: v.price,
        stock: v.stock,
      }))
    );
  }

  const productWithVariants = await Product.findByPk(newProduct.id, {
    include: [{ model: ProductVariant, as: "variants" }],
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, productWithVariants, "Product created successfully")
    );
});

// GET All Products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    include: [{ model: ProductVariant, as: "variants" }],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// GET Product By ID
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, {
    include: [{ model: ProductVariant, as: "variants" }],
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// UPDATE Product
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { variants } = req.body;

  const product = await productService.updateProduct({
    id,
    file: req.file,
    ...req.body,
  });

  // Replace-all: the admin form always submits the full current variant list.
  if (variants !== undefined) {
    const parsedVariants = parseVariants(variants);
    await ProductVariant.destroy({ where: { productId: product.id } });
    if (parsedVariants.length > 0) {
      await ProductVariant.bulkCreate(
        parsedVariants.map((v) => ({
          productId: product.id,
          size: v.size,
          price: v.price,
          stock: v.stock,
        }))
      );
    }
  }

  const updatedProduct = await Product.findByPk(product.id, {
    include: [{ model: ProductVariant, as: "variants" }],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProduct, "Product updated successfully")
    );
});

// DELETE Product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await productService.deleteProduct({ id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

// SEARCH Products
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const products = await productService.searchProducts({ query: q });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// GET Products By Category
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const products = await productService.getProductsByCategory({ category });

  return res
    .status(200)
    .json(new ApiResponse(200, products, `Products in category: ${category}`));
});

// GET Total Products Count
export const getNumberOfTotalproduct = asyncHandler(async (req, res) => {
  const totalProducts = await productService.getNumberOfTotalproduct();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { totalProducts }, "Total products count fetched successfully")
    );
});

// GET Featured Products
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: { isFeatured: true },
    include: [{ model: ProductVariant, as: "variants" }],
  });
  res.status(200).json(new ApiResponse(200, products, "Featured products"));
});

// GET New Arrivals
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: { isNewArrival: true },
    include: [{ model: ProductVariant, as: "variants" }],
  });
  res.status(200).json(new ApiResponse(200, products, "New Arrivals"));
});

// GET On Sale Products
export const getOnSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: { isOnSale: true },
    include: [{ model: ProductVariant, as: "variants" }],
  });
  res.status(200).json(new ApiResponse(200, products, "On Sale products"));
});
