import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
<<<<<<< HEAD:client/src/user_side/pages/AllProductsRender.tsx
  useFeaturedProductsQuery,
  useOnSaleProductsQuery,
  useNewArrivalsQuery,
} from "../../queries/productQueries";
=======
  fetchFeaturedProducts,
  fetchOnSaleProducts,
  fetchNewArrivals,
} from "../../redux/thunks/ProductThunk";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/AllProductsRender.tsx
import { motion } from "framer-motion";
import ProductCard from "../component/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../component/QuickViewModal";
import SEO from "../../components/ui/SEO";

const AllProductsRender = () => {
  const location = useLocation();
  const { category } = (location.state as { category: string }) || { category: "featured" };
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Query setups
  const featuredQuery = useFeaturedProductsQuery();
  const onSaleQuery = useOnSaleProductsQuery();
  const newArrivalsQuery = useNewArrivalsQuery();

<<<<<<< HEAD:client/src/user_side/pages/AllProductsRender.tsx
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
=======
  // Fetch the correct category if not already fetched
  useEffect(() => {
    if (category === "featured") dispatch(fetchFeaturedProducts());
    else if (category === "onSale") dispatch(fetchOnSaleProducts());
    else if (category === "newArrival") dispatch(fetchNewArrivals());
  }, [category, dispatch]);

  // Choose products based on category
  let productsToShow = [];

  if (category === "featured") {
    productsToShow = featuredProducts;
  } else if (category === "onSale") {
    productsToShow = onSaleProducts;
  } else if (category === "newArrival") {
    productsToShow = newArrivals;
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/AllProductsRender.tsx
  }

  const bgColor = "bg-gradient-to-br from-luxury-ink via-[#141414] to-luxury-ink";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
<<<<<<< HEAD:client/src/user_side/pages/AllProductsRender.tsx
    <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-950 py-12">
      <SEO title={titleText} description={`${titleText} - ${tagText}`} />
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Header */}
        <div className="pt-16 mb-10">
          <span className="text-[10px] tracking-[0.3em] text-neutral-400 dark:text-neutral-500 font-bold uppercase">
            {tagText}
          </span>
          <h1 className="text-4xl font-light text-neutral-900 dark:text-white tracking-wide mt-2">
            {titleText}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-center">
            Failed to retrieve collection. Please try again.
          </div>
=======
    <div className={` rounded-xl p-8 ${bgColor}`}>
      <h2 className="font-logo pt-[80px] text-2xl font-bold mb-6 text-luxury-cream">
        {category === "featured"
          ? "Featured Products"
          : category === "onSale"
          ? "On Sale Products"
          : "New Arrivals"}
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {productsToShow.map((p: any) => (
          <motion.div
            key={p.id}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative border border-luxury-gold/10 rounded-lg shadow-md overflow-hidden bg-luxury-ink hover:border-luxury-gold/30 transition-colors duration-300 flex flex-col"
          >
            {category === "featured" && (
              <span className="absolute top-3 left-3 bg-luxury-gold text-luxury-ink text-xs font-bold px-3 py-1 rounded-md shadow-md">
                FEATURED
              </span>
            )}

            <Link to={`/web/product-detail/${p.id}`} className="flex flex-col flex-grow">
              <img
                src={p.productImage}
                alt={p.title}
                className="w-full h-[280px] object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-luxury-cream truncate">
                  {p.title.slice(0,20)}...
                </h3>
                <p className="text-sm text-luxury-cream/60 mt-1">
                  Quantity: {p.Quantity}
                </p>
                <p className="text-base font-bold text-luxury-gold mt-1">
                  Rs. {category === "onSale" && p.isOnSale && p.discountPrice
                    ? p.discountPrice
                    : p.price}
                </p>
              </div>
            </Link>

            <div className="p-4 pt-0">
              <button className="mt-3 w-full border border-luxury-gold/30 bg-transparent text-luxury-cream py-2 rounded-md transition-colors duration-300 hover:border-luxury-gold hover:bg-luxury-gold/10 hover:text-luxury-gold">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}

        {!loading && productsToShow.length === 0 && (
          <div className="col-span-full text-luxury-cream/50">No products.</div>
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/AllProductsRender.tsx
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
          <div className="text-center py-20 text-neutral-500">
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
