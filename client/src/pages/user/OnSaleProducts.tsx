import { useState } from "react";
import { useOnSaleProductsQuery } from "../../queries/productQueries";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../../components/user/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../../components/user/QuickViewModal";

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
      <div className="mt-12 p-6 bg-red-950/40 border border-red-900/50 rounded-2xl text-center text-red-300">
        Error loading sale products. Please try again.
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.2em] text-luxury-gold font-bold uppercase">
            Exclusive Deals
          </span>
          <h2 className="font-logo text-3xl font-light tracking-wide text-white mt-1">
            On Sale Impressions
          </h2>
        </div>

        {onSaleProducts.length > 4 && (
          <Link
            to="/all-products"
            state={{ category: "onSale" }}
            className="text-xs tracking-wider uppercase font-semibold text-luxury-gold hover:text-luxury-gold-bright transition-colors duration-300 border-b border-luxury-gold/30 pb-0.5"
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
            <div className="col-span-full text-center text-luxury-cream/50 py-10">
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
    </div>
  );
};

export default OnSaleProducts;
