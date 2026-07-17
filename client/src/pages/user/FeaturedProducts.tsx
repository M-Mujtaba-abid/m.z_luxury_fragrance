<<<<<<< HEAD:client/src/user_side/pages/FeaturedProducts.tsx
import { useState } from "react";
import { useFeaturedProductsQuery } from "../../queries/productQueries";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../component/QuickViewModal";
=======
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchFeaturedProducts } from "../../redux/thunks/ProductThunk";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddToCartButton from "../../components/user/AddToCartButton";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/FeaturedProducts.tsx

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
<<<<<<< HEAD:client/src/user_side/pages/FeaturedProducts.tsx
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
=======
    <div className="mt-12 rounded-xl p-8 bg-gradient-to-br from-luxury-ink via-[#141414] to-luxury-ink">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-logo text-2xl font-bold text-luxury-cream">
          Featured Collections
        </h2>

        {/* // Slice first 4 products
const productsToShow = featuredProducts.slice(0, 4);

// Button below grid */}
{featuredProducts.length > 3&& (
  <div className="text-center mt-8">
    <Link
      to="/web/all-products"
      state={{ category: "featured" }}

      className="px-6 py-2 text-luxury-gold hover:underline rounded-lg transition-colors duration-300"
    >
      View More -
    </Link>
  </div>
)}
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/FeaturedProducts.tsx

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

<<<<<<< HEAD:client/src/user_side/pages/FeaturedProducts.tsx
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
=======
      {/* Product Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {productsToShow.map((p: any) => (
          <motion.div
            key={p.id}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative border border-luxury-gold/10 rounded-lg shadow-md overflow-hidden bg-luxury-ink hover:border-luxury-gold/30 transition-colors duration-300 flex flex-col"
          >
            <span className="absolute top-3 left-3 bg-luxury-gold text-luxury-ink text-xs font-bold px-3 py-1 rounded-md shadow-md">
              FEATURED
            </span>

            <Link to={`/web/product-detail/${p.id}`} className="flex flex-col flex-grow">
              <img
                src={p.productImage}
                alt={p.title}
                className="w-full h-[280px] object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-luxury-cream truncate">
                  {p.title}
                </h3>
                <p className="text-sm text-luxury-cream/60 mt-1">
                  Quantity: {p.Quantity}
                </p>
                <p className="text-base font-bold text-luxury-gold mt-1">
                  Rs. {p.price}
                </p>
              </div>
            </Link>

            <AddToCartButton productId={p.id} className="p-4 pt-0" />
          </motion.div>
        ))}

        {!loading && featuredProducts.length === 0 && (
          <div className="col-span-full text-luxury-cream/50">
            No featured products.
          </div>
        )}
      </motion.div>
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/FeaturedProducts.tsx
    </div>
  );
};

export default FeaturedProducts;
