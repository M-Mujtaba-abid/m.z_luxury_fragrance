import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchFeaturedProducts } from "../../redux/Admin/AdminThunk/ProductThunk";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddToCartButton from "../component/AddToCartButton";

const FeaturedProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts = [], loading } = useSelector(
    (s: RootState) => s.products
  );

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Only show first 8 products on Home
  const productsToShow = featuredProducts.slice(0, 4);

  return (
    <div className="mt-12 rounded-xl p-8 bg-gradient-to-br from-blue-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
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

      className="px-6 py-2  text-blue-500  rounded-lg transition"
    > 
      View More -
    </Link>
  </div>
)}

      </div>

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
            className="relative border rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col"
          >
            <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
              FEATURED
            </span>

            <Link to={`/web/product-detail/${p.id}`} className="flex flex-col flex-grow">
              <img
                src={p.productImage}
                alt={p.title}
                className="w-full h-[280px] object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Quantity: {p.Quantity}
                </p>
                <p className="text-base font-bold text-gray-800 dark:text-white mt-1">
                  Rs. {p.price}
                </p>
              </div>
            </Link>

            <AddToCartButton productId={p.id} className="p-4 pt-0" />
          </motion.div>
        ))}

        {!loading && featuredProducts.length === 0 && (
          <div className="col-span-full text-gray-500">
            No featured products.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FeaturedProducts;
