import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearchProductsQuery } from "../../queries/productQueries";
import { ArrowLeft } from "lucide-react";
import ProductCard from "./ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "./QuickViewModal";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: searchResults = [], isLoading, error } = useSearchProductsQuery(query);

  return (
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
              />
            ))}
          </div>
        )}

        {!isLoading && searchResults.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            No luxury impressions found matching your search.
          </div>
        )}
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
