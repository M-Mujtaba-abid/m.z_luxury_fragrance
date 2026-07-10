import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, deleteProduct } from "../../../redux/Admin/AdminThunk/ProductThunk";
import { clearError, clearCurrentProduct } from "../../../redux/Admin/AdminSlice/ProductSlice";
import type { RootState, AppDispatch } from "../../../redux/store";

const ProductDetailPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { loading, error, currentProduct } = useSelector(
    (state: RootState) => state.products
  ) as any;

  console.log('ProductDetailPage rendering with productId:', productId);
  console.log('Current product state:', { loading, error, currentProduct });

  useEffect(() => {
    if (productId) {
      console.log('Fetching product with ID:', productId);
      dispatch(getProductById(parseInt(productId)));
    }

    return () => {
      dispatch(clearError());
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

  const handleDelete = async () => {
    if (!currentProduct) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(currentProduct.id)).unwrap();
        navigate("/admin/products");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleEdit = () => {
    if (!currentProduct) return;
    navigate(`/admin/product/${currentProduct.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Product Details
              </h1>
              <button
                onClick={() => navigate("/admin/products")}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Products
              </button>
            </div>
          </div>

          {/* Product Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                  <img
                    src={currentProduct.productImage}
                    alt={currentProduct.title}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {currentProduct.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {currentProduct.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Price:
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      Rs. {currentProduct.price}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentProduct.status === "available"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {currentProduct.status}
                    </span>
                  </div>

                  {/* Stock */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Stock:
                    </span>
                    <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {currentProduct.stock} units
                    </span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Category:
                    </span>
                    <span className="text-lg font-medium text-gray-800 dark:text-gray-100 capitalize">
                      {currentProduct.category}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Quantity:
                    </span>
                    <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {currentProduct.Quantity}
                    </span>
                  </div>

                  {/* Homepage Control Fields */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Featured Product:
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentProduct.isFeatured
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {currentProduct.isFeatured ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      New Arrival:
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentProduct.isNewArrival
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {currentProduct.isNewArrival ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      On Sale:
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentProduct.isOnSale
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {currentProduct.isOnSale ? "Yes" : "No"}
                    </span>
                  </div>

                  {/* Discount Price */}
                  {currentProduct.isOnSale && currentProduct.discountPrice && (
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/40 rounded-lg">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Discount Price:
                      </span>
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        Rs. {currentProduct.discountPrice}
                      </span>
                    </div>
                  )}

                  {/* Created Date */}
                  {currentProduct.createdAt && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Created:
                      </span>
                      <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
                        {new Date(currentProduct.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleEdit}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
