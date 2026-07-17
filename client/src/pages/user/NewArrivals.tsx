import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchNewArrivals } from "../../redux/thunks/ProductThunk";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddToCartButton from "../../components/user/AddToCartButton";

const NewArrivals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newArrivals = [], loading } = useSelector(
    (s: RootState) => s.products
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Update active dot based on scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 260 + 24; // card width + gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };

  return (
    <div
      className=" rounded-xl p-8
      bg-gradient-to-br from-luxury-ink via-[#141414] to-luxury-ink relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-logo text-2xl text-luxury-cream font-bold">New Arrivals</h2>
        <Link
           to="/web/all-products"
           state={{ category: "newArrival" }}
          className="text-luxury-gold hover:underline text-sm md:text-base"
        >
          View more
        </Link>
      </div>

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-luxury-ink border border-luxury-gold/20 p-2 rounded-full shadow hover:bg-luxury-gold/10 transition-colors duration-300"
      >
        <ChevronLeft className="w-5 h-5 text-luxury-cream" />
      </button>

      {/* Product Row */}
      <motion.div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
      >
        {newArrivals.map((p: any) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="min-w-[260px] max-w-[260px] border border-luxury-gold/10 rounded-lg shadow-md overflow-hidden bg-luxury-ink hover:border-luxury-gold/30 transition-colors duration-300 flex flex-col"
          >
            {/* ✅ Clickable Part */}
            <Link to={`/web/product-detail/${p.id}`} className="flex flex-col flex-grow">
              {/* Image */}
              <img
                src={p.productImage}
                alt={p.title}
                className="w-full h-[280px] object-cover"
              />

              {/* Card Body */}
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

            {/* ✅ Add to Cart Btn */}
            <AddToCartButton productId={p.id} className="p-4 pt-0" />
          </motion.div>
        ))}

        {/* No Data Case */}
        {!loading && newArrivals.length === 0 && (
          <div className="text-luxury-cream/50">No new arrivals.</div>
        )}
      </motion.div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-luxury-ink border border-luxury-gold/20 p-2 rounded-full shadow hover:bg-luxury-gold/10 transition-colors duration-300"
      >
        <ChevronRight className="w-5 h-5 text-luxury-cream" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {newArrivals.map((_: any, index: number) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === activeIndex
                ? "bg-luxury-gold"
                : "bg-luxury-cream/20"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
