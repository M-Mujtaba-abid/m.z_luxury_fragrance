// SearchResults.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { searchProductsThunk } from "../../redux/Admin/AdminThunk/ProductThunk";
import type { RootState, AppDispatch } from "../../redux/store";
import AddToCartButton from "./AddToCartButton";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { searchResults, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (query) {
      dispatch(searchProductsThunk(query));
    }
  }, [query, dispatch]);

  return (
    <div className="pt-[100px] p-6">
      {/* Sticky Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 right-6 z-50 px-3 py-1 border rounded-md bg-white dark:bg-gray-800 dark:text-white text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition"
      >
        Back
      </button>

      <h2 className="text-xl font-bold mb-4 dark:text-white">
        Search results for: "{query}"
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {searchResults.length === 0 && !loading && (
        <p className="text-gray-500">No products found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {searchResults.map((p: any) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative border rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col"
          >
            <Link
              to={`/web/product-detail/${p.id}`}
              className="flex flex-col flex-grow"
            >
              <img
                src={p.productImage}
                alt={p.title}
                className="w-full h-[220px] sm:h-[250px] md:h-[280px] object-cover"
              />

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate mt-2 px-2">
                {p.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 px-2">
                Quantity: {p.Quantity}
              </p>

              {p.isOnSale && p.discountPrice ? (
                <div className="mt-2 px-2">
                  <span className="text-sm text-gray-500 line-through">
                    Rs. {p.price}
                  </span>
                  <span className="text-sm font-bold text-red-600 ml-2">
                    Rs. {p.discountPrice}
                  </span>
                </div>
              ) : (
                <p className="text-base font-bold text-gray-800 dark:text-white mt-1 px-2">
                  Rs. {p.price}
                </p>
              )}
            </Link>

            <div className="p-4 pt-0">
              <AddToCartButton productId={p.id} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
