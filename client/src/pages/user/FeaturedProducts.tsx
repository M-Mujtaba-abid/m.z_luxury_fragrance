import { useState } from "react";
import { useFeaturedProductsQuery } from "../../queries/productQueries";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../../components/user/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../../components/user/QuickViewModal";

const FeaturedProducts = () => {
  const { data: featuredProducts = [], isLoading, error } = useFeaturedProductsQuery();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  // Show first 4 products in featured block
  const productsToShow = featuredProducts.slice(0, 4);

  if (error) {
    return (
      <div className="mt-12 p-6 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-center text-rose-500">
        Error loading featured collections. Please try again.
      </div>
    );
  }

  return (
    <div className="mt-12 rounded-3xl p-8 border border-neutral-100 dark:border-neutral-900 bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-bold uppercase">
            Curated Blends
          </span>
          <h2 className="text-3xl font-light tracking-wide text-neutral-900 dark:text-white mt-1">
            Featured Collections
          </h2>
        </div>

        {featuredProducts.length > 4 && (
          <Link
            to="/web/all-products"
            state={{ category: "featured" }}
            className="text-xs tracking-wider uppercase font-semibold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300 border-b border-neutral-300 dark:border-neutral-700 pb-0.5"
          >
            View More
          </Link>
        )}
      </div>

      {/* Product Grid / Skeleton */}
      {isLoading ? (
        <ProductsGridSkeleton count={4} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {productsToShow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}

          {productsToShow.length === 0 && (
            <div className="col-span-full text-center text-neutral-400 py-10">
              No featured products available.
            </div>
          )}
        </motion.div>
      )}

      {/* Direct Interactive Quick View Drawer */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default FeaturedProducts;
