import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  getProductById,
} from "../../../redux/Admin/AdminThunk/ProductThunk";
import { clearError } from "../../../redux/Admin/AdminSlice/ProductSlice";
import type { RootState, AppDispatch } from "../../../redux/store";
import type { ProductData } from "../../../redux/Admin/typesAdminComponent/productTypes";

const PostProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  const { loading, error, currentProduct } = useSelector(
    (state: RootState) => state.products
  );

  const isEditMode = !!productId;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "available" as "available" | "not available",
    price: "",
    stock: "",
    category: "Men" as "Men" | "Women" | "Children",
    Quantity: "15ML" as "15ML" | "50ML" | "100ML",
    productImage: null as File | null,
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
    discountPrice: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  // ✅ Fetch product by ID in edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      dispatch(getProductById(parseInt(productId)));
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, productId, isEditMode]);

  // ✅ Prefill form when currentProduct updates
  useEffect(() => {
    if (isEditMode && currentProduct) {
      setFormData({
        title: currentProduct.title,
        description: currentProduct.description,
        status: currentProduct.status,
        price: currentProduct.price?.toString(),
        stock: currentProduct.stock?.toString(),
        category: currentProduct.category,
        Quantity: currentProduct.Quantity,
        productImage: null,
        isFeatured: currentProduct.isFeatured,
        isNewArrival: currentProduct.isNewArrival,
        isOnSale: currentProduct.isOnSale,
        discountPrice: currentProduct.discountPrice?.toString(),
      });
      setImagePreview(currentProduct.productImage);
    }
  }, [currentProduct, isEditMode]);

  // ✅ Input change handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, productImage: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      if (!productId) return;

      const updateData: any = {
        id: productId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        Quantity: formData.Quantity,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isOnSale: formData.isOnSale,
        discountPrice: parseFloat(formData.discountPrice),
      };
      if (formData.productImage) updateData.productImage = formData.productImage;

      try {
        await dispatch(updateProduct(updateData)).unwrap();
        navigate("/admin/products");
      } catch (error) {
        console.error("Update failed:", error);
      }
    } else {
      if (!formData.productImage) {
        alert("Please select an image");
        return;
      }

      const productData: ProductData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        Quantity: formData.Quantity,
        productImage: formData.productImage,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isOnSale: formData.isOnSale,
        discountPrice: parseFloat(formData.discountPrice),
      };

      try {
        await dispatch(createProduct(productData)).unwrap();
        setFormData({
          title: "",
          description: "",
          status: "available",
          price: "",
          stock: "",
          category: "Men",
          Quantity: "15ML",
          productImage: null,
          isFeatured: false,
          isNewArrival: false,
          isOnSale: false,
          discountPrice: "",
        });
        setImagePreview("");
      } catch (error) {
        console.error("Create failed:", error);
      }
    }
  };

  // ✅ Common Input Class
  const inputClass =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
    "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700";

  const labelClass =
    "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? "Edit Product" : "Create New Product"}
          </h1>
          {isEditMode && (
            <button
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={labelClass}>Product Title *</label>
            <input
              type="text"
              placeholder="Enter Product Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="description"
              placeholder="Enter Product Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className={inputClass}
            />
          </div>

          {/* Status & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="available">Available</option>
                <option value="not available">Not Available</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Children">Children</option>
                
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className={labelClass}>Quantity *</label>
            <select
              name="Quantity"
              value={formData.Quantity}
              onChange={handleInputChange}
              className={inputClass}
            >
              <option value="15ML">15ML</option>
              <option value="50ML">50ML</option>
              <option value="100ML">100ML</option>
            </select>
          </div>

          {/* Homepage Control Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Featured Product</label>
              <select
                name="isFeatured"
                value={formData.isFeatured.toString()}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>New Arrival</label>
              <select
                name="isNewArrival"
                value={formData.isNewArrival.toString()}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          {/* Sale Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>On Sale</label>
              <select
                name="isOnSale"
                value={formData.isOnSale.toString()}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Discount Price</label>
              <input
                type="number"
                name="discountPrice"
                placeholder="Enter discount price"
                value={formData.discountPrice}
                onChange={handleInputChange}
                className={inputClass}
                disabled={!formData.isOnSale}
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price *</label>
              <input
                type="number"
                name="price"
                placeholder="Enter Product Price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stock *</label>
              <input
                type="number"
                name="stock"
                placeholder="Enter Product Stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className={labelClass}>
              Product Image {isEditMode ? "(optional)" : "*"}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className={inputClass}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-md border dark:border-gray-600"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProduct;
