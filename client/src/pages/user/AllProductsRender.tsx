import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  useFeaturedProductsQuery,
  useOnSaleProductsQuery,
  useNewArrivalsQuery,
} from "../../queries/productQueries";
import { motion } from "framer-motion";
import ProductCard from "../../components/user/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../../components/user/QuickViewModal";
import SEO from "../../components/ui/SEO";
import Breadcrumb from "../../components/ui/Breadcrumb";

const AllProductsRender = () => {
  const location = useLocation();
  const { category } = (location.state as { category: string }) || { category: "featured" };
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Query setups
  const featuredQuery = useFeaturedProductsQuery();
  const onSaleQuery = useOnSaleProductsQuery();
  const newArrivalsQuery = useNewArrivalsQuery();

  let productsToShow: any[] = [];
  let isLoading = false;
  let error = null;
  let titleText = "";
  let tagText = "";

  if (category === "featured") {
    productsToShow = featuredQuery.data || [];
    isLoading = featuredQuery.isLoading;
    error = featuredQuery.error;
    titleText = "Featured Collections";
    tagText = "Curated luxury selects";
  } else if (category === "onSale") {
    productsToShow = onSaleQuery.data || [];
    isLoading = onSaleQuery.isLoading;
    error = onSaleQuery.error;
    titleText = "On Sale Impressions";
    tagText = "Limited seasonal pricing";
  } else if (category === "newArrival") {
    productsToShow = newArrivalsQuery.data || [];
    isLoading = newArrivalsQuery.isLoading;
    error = newArrivalsQuery.error;
    titleText = "New Arrivals";
    tagText = "Fresh olfactory impressions";
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-luxury-ink py-12">
      <SEO title={titleText} description={`${titleText} - ${tagText}`} />
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">

        {/* Header */}
        <div className="pt-16 mb-10">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Collection", path: "/all" },
              { label: titleText },
            ]}
          />
          <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase">
            {tagText}
          </span>
          <h1 className="font-logo text-4xl font-light text-luxury-cream tracking-wide mt-2">
            {titleText}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 text-red-300 rounded-2xl text-center">
            Failed to retrieve collection. Please try again.
          </div>
        )}

        {/* Product Grid / Skeleton */}
        {isLoading ? (
          <ProductsGridSkeleton count={6} />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {productsToShow.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </motion.div>
        )}

        {!isLoading && productsToShow.length === 0 && (
          <div className="text-center py-20 text-luxury-cream/50">
            No items in this collection.
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

export default AllProductsRender;
