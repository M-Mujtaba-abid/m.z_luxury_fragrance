// AllProductsRender.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  fetchFeaturedProducts,
  fetchOnSaleProducts,
  fetchNewArrivals,
} from "../../redux/thunks/ProductThunk";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AllProductsRender = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { category } = location.state as { category: string };

  const { featuredProducts, onSaleProducts, newArrivals, loading } = useSelector(
    (state: RootState) => state.products
  );

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
  }

  const bgColor = "bg-gradient-to-br from-luxury-ink via-[#141414] to-luxury-ink";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
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
        )}
      </motion.div>
    </div>
  );
};

export default AllProductsRender;
