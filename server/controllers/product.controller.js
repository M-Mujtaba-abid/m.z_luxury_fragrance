// server/controllers/product.controller.js
import Product from "../models/product.model.js";
import ProductVariant from "../models/productVariant.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
// import { Op } from "sequelize";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

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

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.findAll({
    include: [{ model: ProductVariant, as: "variants" }],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ✅ Get Single Product by

export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, {
    include: [{ model: ProductVariant, as: "variants" }],
  });

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ✅ Update Product
// export const updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { title, description, status, price, stock, category, Quantity } = req.body;

//   const product = await Product.findByPk(id);
//   if (!product) {
//     return next(new ApiError(404, "Product not found"));
//   }

//   let uploadedImageUrl = product.productImage; // default: old image

//   if (req.file) {
//     const streamUpload = (reqFile) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "products" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );
//         streamifier.createReadStream(reqFile.buffer).pipe(stream);
//       });
//     };

//     const uploadedImage = await streamUpload(req.file);
//     uploadedImageUrl = uploadedImage.secure_url;
//   }

//   // Update product fields
//   await product.update({
//     title,
//     description,
//     status,
//     price,
//     stock,
//     category,
//     Quantity,
//     productImage: uploadedImageUrl, // old or new
//   });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, product, "Product updated successfully"));
// });

// UPDATE Product
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
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

// ✅ Delete Product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  await product.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});


export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q)
      return res.status(400).json({ message: "Search query is required" });

    // Convert search term to lowercase for consistency
    const searchTerm = q.toLowerCase();
    const term = `%${searchTerm}%`;

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: term } },
          { description: { [Op.iLike]: term } },
          where(cast(col("category"), "TEXT"), { [Op.iLike]: term }),
        ],
      },
    });

    if (!products.length)
      return res.status(404).json({ message: "No products found" });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// ✅ Get Products by Category
export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params; // path param /product/category/:category

  if (!category) {
    return next(new ApiError(400, "Category is required"));
  }

  // Validate category against enum values
  const allowedCategories = ["perfume", "accesories"];
  if (!allowedCategories.includes(category.toLowerCase())) {
    return next(new ApiError(400, "Invalid category"));
  }

  const products = await Product.findAll({
    where: { category: category.toLowerCase() },
  });

  if (products.length === 0) {
    return next(new ApiError(404, "No products found in this category"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, products, `Products in category: ${category}`));
});

// ✅ Get Number of Total Products
export const getNumberOfTotalproduct = asyncHandler(async (req, res, next) => {
  try {
    const totalProducts = await Product.count(); // Sequelize ka built-in count method

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalProducts },
          "Total products count fetched successfully"
        )
      );
  } catch (error) {
    return next(new ApiError(500, "Failed to fetch total products count"));
  }
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({ where: { isFeatured: true } });
  res.status(200).json(new ApiResponse(200, products, "Featured products"));
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.findAll({ where: { isNewArrival: true } });
  res.status(200).json(new ApiResponse(200, products, "New Arrivals"));
});

export const getOnSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({ where: { isOnSale: true } });
  res.status(200).json(new ApiResponse(200, products, "On Sale products"));
});
