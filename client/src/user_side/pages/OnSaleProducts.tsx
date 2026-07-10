import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchOnSaleProducts } from "../../redux/Admin/AdminThunk/ProductThunk";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddToCartButton from "../component/AddToCartButton";

const OnSaleProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { onSaleProducts = [], loading } = useSelector(
    (s: RootState) => s.products
  );

  
  useEffect(() => {
    dispatch(fetchOnSaleProducts());
  }, [dispatch]);
  
  const [showAll] = useState(false);
  const productsToShow = showAll ? onSaleProducts : onSaleProducts.slice(0, 8);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="mt-12 rounded-xl p-8
      bg-gradient-to-br from-red-100 via-white to-red-100
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          On Sale Impressions
        </h2>
        <Link
           to="/web/all-products"
           state={{ category: "onSale" }}
          className="text-blue-600 hover:underline text-sm md:text-base"
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
            className="relative border rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 flex flex-col"
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

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate mt-2 px-2">
                {p.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 px-2">
                Quantity: {p.Quantity}
              </p>

              {p.isOnSale && p.discountPrice ? (
                <div className="mt-2 px-2">
                  <span className="text-sm text-gray-500 line-through">
                    Rs. {p.price}
                  </span>
                  <span className="text-sm font-bold text-red-600 ml-2">
                    Rs. {p.discountPrice}
                  </span>
                </div>
              ) : (
                <p className="text-base font-bold text-gray-800 dark:text-white mt-1 px-2">
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
          <div className="col-span-full text-gray-500">
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
    </div>
  );
};

export default OnSaleProducts;
