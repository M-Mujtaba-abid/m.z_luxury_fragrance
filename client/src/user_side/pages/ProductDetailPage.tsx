import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../redux/Admin/AdminThunk/ProductThunk";
import {
  clearError,
  clearCurrentProduct,
} from "../../redux/Admin/AdminSlice/ProductSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import AddToCartButton from "../component/AddToCartButton";

const ProductDetailPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { loading, error, currentProduct } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(parseInt(productId)));
    }
    return () => {
      dispatch(clearError());
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

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
    <div className="min-h-screen py-8  bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl pt-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Product Details
              </h1>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back
              </button>
            </div>
          </div>

          {/* Product Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-w-1 pt-10 aspect-h-1 w-full overflow-hidden rounded-lg">
                  <img
                    src={currentProduct.productImage}
                    alt={currentProduct.title}
                    className="w-full lg:h-[500px] object-cover rounded-lg shadow-md"
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentProduct.isFeatured && (
                      <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                        ⭐ Featured Product
                      </span>
                    )}
                    {currentProduct.isNewArrival && (
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                        🆕 New Arrival
                      </span>
                    )}
                    {currentProduct.isOnSale && (
                      <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                        🏷️ On Sale
                      </span>
                    )}
                  </div>

                  {/* Discount Price Display */}
                  {currentProduct.isOnSale && currentProduct.discountPrice && (
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/40 rounded-lg">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Original Price:
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        Rs. {currentProduct.price}
                      </span>
                    </div>
                  )}

                  {currentProduct.isOnSale && currentProduct.discountPrice && (
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/40 rounded-lg">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Sale Price:
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        Rs. {currentProduct.discountPrice}
                      </span>
                    </div>
                  )}

                  {/* Created Date */}
                  {/* {currentProduct.createdAt && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <button className="px-4 py-2 bg-blue-600 w-full text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Order now
                      </button>
                    </div>
                    )} */}
                    <AddToCartButton productId={currentProduct.id} className="p-4 pt-0" />
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
