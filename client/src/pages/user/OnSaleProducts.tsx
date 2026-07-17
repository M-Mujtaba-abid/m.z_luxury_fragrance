<<<<<<< HEAD:client/src/user_side/pages/OnSaleProducts.tsx
import { useState } from "react";
import { useOnSaleProductsQuery } from "../../queries/productQueries";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../component/QuickViewModal";
=======
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchOnSaleProducts } from "../../redux/thunks/ProductThunk";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddToCartButton from "../../components/user/AddToCartButton";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/OnSaleProducts.tsx

const OnSaleProducts = () => {
  const { data: onSaleProducts = [], isLoading, error } = useOnSaleProductsQuery();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const productsToShow = onSaleProducts.slice(0, 4);

  if (error) {
    return (
      <div className="mt-12 p-6 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-center text-rose-500">
        Error loading sale products. Please try again.
      </div>
    );
  }

  return (
<<<<<<< HEAD:client/src/user_side/pages/OnSaleProducts.tsx
    <div className="mt-12 rounded-3xl p-8 border border-neutral-100 dark:border-neutral-900 bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-bold uppercase">
            Exclusive Deals
          </span>
          <h2 className="text-3xl font-light tracking-wide text-neutral-900 dark:text-white mt-1">
            On Sale Impressions
          </h2>
        </div>

        {onSaleProducts.length > 4 && (
          <Link
            to="/web/all-products"
            state={{ category: "onSale" }}
            className="text-xs tracking-wider uppercase font-semibold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300 border-b border-neutral-300 dark:border-neutral-700 pb-0.5"
          >
            View All Sales
          </Link>
        )}
      </div>

      {/* Product Grid */}
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
              No products are currently on sale.
            </div>
          )}
        </motion.div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
=======
    <div
      className="mt-12 rounded-xl p-8
      bg-gradient-to-br from-luxury-ink via-[#141414] to-luxury-ink"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-logo text-2xl font-bold text-luxury-cream">
          On Sale Impressions
        </h2>
        <Link
           to="/web/all-products"
           state={{ category: "onSale" }}
          className="text-luxury-gold hover:underline text-sm md:text-base"
        >
          View All Sales Impressions
        </Link>
      </div>

      {/* Product Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {productsToShow.map((p: any) => (
          <motion.div
            key={p.id}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative border border-luxury-gold/10 rounded-lg shadow-md overflow-hidden bg-luxury-ink hover:border-luxury-gold/30 transition-colors duration-300 flex flex-col"
          >
            {/* Link for Image + Title + Price */}
            <Link
              to={`/web/product-detail/${p.id}`}
              className="flex flex-col flex-grow"
            >
              <img
                src={p.productImage}
                alt={p.title}
                className="w-full h-[220px] sm:h-[250px] md:h-[280px] object-cover"
              />

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

            {/* Add to Cart button outside Link */}
            <AddToCartButton productId={p.id} className="p-4 pt-0" />
          </motion.div>
        ))}

        {/* No Data Case */}
        {!loading && onSaleProducts.length === 0 && (
          <div className="col-span-full text-luxury-cream/50">
            No sale products.
          </div>
        )}
      </motion.div>

      {/* Optional "View More" button */}
      {/* {!showAll && onSaleProducts.length > 8 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            View More
          </button>
        </div>
      )} */}
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/OnSaleProducts.tsx
    </div>
  );
};

export default OnSaleProducts;
