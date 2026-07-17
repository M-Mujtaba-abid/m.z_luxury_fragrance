import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductsByCategoryQuery } from "../../queries/productQueries";
import ProductCard from "../component/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../component/QuickViewModal";
import SEO from "../../components/ui/SEO";

const Products = () => {
  const { category } = useParams<{ category: string }>();
  const { data: filteredProducts = [], isLoading, error } = useProductsByCategoryQuery(category);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-950 py-12">
      <SEO title={category ? `${category} Collection` : "All Fragrances"} />
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        
        
        {/* Category Header */}
        <div className="pt-16 mb-10">
          <span className="text-[10px] tracking-[0.3em] text-neutral-400 dark:text-neutral-500 font-bold uppercase">
            Luxury Blends
          </span>
          <h1 className="text-4xl font-light text-neutral-900 dark:text-white tracking-wide capitalize mt-2">
            {category ? `${category} Collection` : "All Products"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-center">
            Failed to retrieve products. Please refresh and try again.
          </div>
        )}

        {/* Product Grid / Skeleton */}
        {isLoading ? (
          <ProductsGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            No products found in the {category} collection.
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

export default Products;
