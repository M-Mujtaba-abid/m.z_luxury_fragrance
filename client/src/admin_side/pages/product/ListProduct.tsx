import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProducts,
  getProductById,
} from "../../../redux/Admin/AdminThunk/ProductThunk";
import { clearError } from "../../../redux/Admin/AdminSlice/ProductSlice";
import type { RootState, AppDispatch } from "../../../redux/store";

const ListProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleDetailView = async (productId: number) => {
    try {
      console.log("Detail View clicked for product ID:", productId);
      await dispatch(getProductById(productId)).unwrap();
      console.log(
        "Product fetched successfully, navigating to:",
        `/admin/product-detail/${productId}`
      );
      navigate(`/admin/product-detail/${productId}`); // ✅ Fixed: Added /admin prefix and correct path
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Product List ({products.length} products)
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={product.productImage}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                    {product.description.slice(0, 20)}...
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      Rs.{product.price}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.status === "available"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-black dark:text-white font-bold">
                      Stock:{" "}
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        {product.stock}
                      </span>
                    </span>

                    <span className="text-sm text-black dark:text-white font-bold capitalize">
                      Category:{" "}
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        {product.category}
                      </span>
                    </span>

                    <span className="text-sm text-black dark:text-white font-bold capitalize">
                      Quantity:{" "}
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        {product.Quantity}
                      </span>
                    </span>
                  </div>

                  {/* New Fields Display */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.isFeatured && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Featured
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        New
                      </span>
                    )}
                    {product.isOnSale && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Sale
                      </span>
                    )}
                  </div>

                  {product.isOnSale && product.discountPrice && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500 line-through">
                        Rs. {product.price}
                      </span>
                      <span className="text-sm font-bold text-red-600 ml-2">
                        Rs. {product.discountPrice}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDetailView(product.id)}
                      className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Detail View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No products found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
