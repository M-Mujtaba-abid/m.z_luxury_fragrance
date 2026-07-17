<<<<<<< HEAD:client/src/user_side/component/SearchResults.tsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearchProductsQuery } from "../../queries/productQueries";
import { ArrowLeft } from "lucide-react";
import ProductCard from "./ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "./QuickViewModal";
=======
// SearchResults.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { searchProductsThunk } from "../../redux/thunks/ProductThunk";
import type { RootState, AppDispatch } from "../../redux/store";
import AddToCartButton from "./AddToCartButton";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/components/user/SearchResults.tsx

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: searchResults = [], isLoading, error } = useSearchProductsQuery(query);

  return (
<<<<<<< HEAD:client/src/user_side/component/SearchResults.tsx
    <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-950 py-12">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300 mb-8 pt-16 text-xs uppercase tracking-wider font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Go Back</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <span className="text-[10px] tracking-[0.3em] text-neutral-400 dark:text-neutral-500 font-bold uppercase">
            Search Directory
          </span>
          <h1 className="text-4xl font-light text-neutral-900 dark:text-white tracking-wide mt-2">
            Results for "{query}"
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-center">
            Failed to perform search. Please try again.
          </div>
        )}

        {/* Product Grid / Skeleton */}
        {isLoading ? (
          <ProductsGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
=======
    <div className="min-h-screen bg-luxury-ink pt-[100px] p-6">
      {/* Sticky Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 right-6 z-50 px-3 py-1 border border-luxury-gold/20 rounded-md bg-luxury-ink text-luxury-cream hover:bg-luxury-gold/10 hover:text-luxury-gold shadow-sm transition-colors duration-300"
      >
        Back
      </button>

      <h2 className="font-logo text-xl font-bold mb-4 text-luxury-cream">
        Search results for: "{query}"
      </h2>

      {loading && <p className="text-luxury-cream/60">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {searchResults.length === 0 && !loading && (
        <p className="text-luxury-cream/50">No products found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {searchResults.map((p: any) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative border border-luxury-gold/10 rounded-lg shadow-md overflow-hidden bg-luxury-ink hover:border-luxury-gold/30 transition-colors duration-300 flex flex-col"
          >
            <Link
              to={`/web/product-detail/${p.id}`}
              className="flex flex-col flex-grow"
            >
              <img
                src={p.productImage}
                alt={p.title}
                className="w-full h-[220px] sm:h-[250px] md:h-[280px] object-cover"
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/components/user/SearchResults.tsx
              />
            ))}
          </div>
        )}

<<<<<<< HEAD:client/src/user_side/component/SearchResults.tsx
        {!isLoading && searchResults.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            No luxury impressions found matching your search.
          </div>
        )}
=======
              <h3 className="text-lg font-semibold text-luxury-cream truncate mt-2 px-2">
                {p.title}
              </h3>

              <p className="text-sm text-luxury-cream/60 mt-1 px-2">
                Quantity: {p.Quantity}
              </p>

              {p.isOnSale && p.discountPrice ? (
                <div className="mt-2 px-2">
                  <span className="text-sm text-luxury-cream/40 line-through">
                    Rs. {p.price}
                  </span>
                  <span className="text-sm font-bold text-luxury-gold ml-2">
                    Rs. {p.discountPrice}
                  </span>
                </div>
              ) : (
                <p className="text-base font-bold text-luxury-gold mt-1 px-2">
                  Rs. {p.price}
                </p>
              )}
            </Link>

            <div className="p-4 pt-0">
              <AddToCartButton productId={p.id} />
            </div>
          </motion.div>
        ))}
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/components/user/SearchResults.tsx
      </div>

      {/* Quick View Drawer */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default SearchResults;
