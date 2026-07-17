import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getNumberOfTotalproduct,
  getFeaturedProducts,
  getNewArrivals,
  getOnSaleProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.js";
import {
  validateCreateProduct,
  validateProductId,
  validateCategoryParam,
  validateSearchQuery,
} from "../validators/product.validator.js";

const router = express.Router();

// `productImage`: legacy single-file field (current admin form still uses this)
// `images`: new multi-image gallery field (drag-and-drop product form)
const productImageUpload = upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

router.post(
  "/postproduct",
  productImageUpload,
  validateCreateProduct,
  createProduct
);
router.get("/getallproduct", getAllProducts);
router.get("/getsingleproduct/:id", validateProductId, getProductById);
router.get("/getfeaturedproducts",getFeaturedProducts);
router.get("/getnewarrivals",     getNewArrivals);
router.get("/getonsaleproducts" ,   getOnSaleProducts);
router.patch(
  "/updateproduct/:id",
  productImageUpload,
  validateProductId,
  updateProduct
);
router.delete("/deleteproduct/:id", validateProductId, deleteProduct);
router.get("/getNumberOfTotalproduct", getNumberOfTotalproduct);
// now not use
router.get("/search", validateSearchQuery, searchProducts);
router.get("/getproductbycategory/:category", validateCategoryParam, getProductsByCategory);
// router.delete("/search",searchProducts);

export default router;
