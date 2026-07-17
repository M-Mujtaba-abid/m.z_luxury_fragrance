<<<<<<< HEAD
// server/controllers/product.controller.js
import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
=======
import * as productService from "../services/product.service.js";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

<<<<<<< HEAD
import { Op, where, col, cast } from "sequelize";

// Multipart forms can't send a nested array, so the frontend sends `variants`
// as a JSON string and we parse it here. Absent/invalid input is treated as "no variants".
const parseVariants = (rawVariants) => {
  if (!rawVariants) return [];
  try {
    const parsed = JSON.parse(rawVariants);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// CREATE Product

//create

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
    return next(new ApiError(400, "All fields are required"));
  }

  let uploadedImage;

  const streamUpload = (reqFile) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(reqFile.buffer).pipe(stream);
    });
  };

  uploadedImage = await streamUpload(req.file);

  const newProduct = await Product.create({
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
=======
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct({ ...req.body, file: req.file });
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

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
<<<<<<< HEAD
    .json(
      new ApiResponse(201, productWithVariants, "Product created successfully")
    );
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.findAll({
    include: [{ model: ProductVariant, as: "variants" }],
  });
=======
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
<<<<<<< HEAD
  const product = await Product.findByPk(id, {
    include: [{ model: ProductVariant, as: "variants" }],
  });

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }
=======
  const product = await productService.getProductById({ id });
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
<<<<<<< HEAD
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

  const product = await Product.findByPk(id);
  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  let uploadedImageUrl = product.productImage;

  if (req.file) {
    const streamUpload = (reqFile) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(reqFile.buffer).pipe(stream);
      });
    };

    const uploadedImage = await streamUpload(req.file);
    uploadedImageUrl = uploadedImage.secure_url;
  }

  await product.update({
    title,
    description,
    status,
    price,
    stock,
    category,
    Quantity,
    productImage: uploadedImageUrl,
    isFeatured,
    isNewArrival,
    isOnSale,
    discountPrice,
  });
=======
  const product = await productService.updateProduct({ id, file: req.file, ...req.body });
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

  // Replace-all: the admin form always submits the full current variant list.
  // Guarded on `undefined` so API callers that omit the field don't wipe existing variants.
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
