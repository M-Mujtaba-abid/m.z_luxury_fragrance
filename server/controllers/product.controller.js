import * as productService from "../services/product.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct({ ...req.body, files: req.files });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const includeAll = req.query.includeAll === "true";
  const products = await productService.getAllProducts({ includeAll });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const includeAll = req.query.includeAll === "true";
  const product = await productService.getProductById({ id, includeAll });

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.updateProduct({ id, files: req.files, ...req.body });

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await productService.deleteProduct({ id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const products = await productService.searchProducts({ query: q });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const products = await productService.getProductsByCategory({ category });

  return res
    .status(200)
    .json(new ApiResponse(200, products, `Products in category: ${category}`));
});

export const getNumberOfTotalproduct = asyncHandler(async (req, res) => {
  const totalProducts = await productService.getNumberOfTotalproduct();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { totalProducts }, "Total products count fetched successfully")
    );
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts();
  res.status(200).json(new ApiResponse(200, products, "Featured products"));
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await productService.getNewArrivals();
  res.status(200).json(new ApiResponse(200, products, "New Arrivals"));
});

export const getOnSaleProducts = asyncHandler(async (req, res) => {
  const products = await productService.getOnSaleProducts();
  res.status(200).json(new ApiResponse(200, products, "On Sale products"));
});
