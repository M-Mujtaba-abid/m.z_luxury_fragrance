<<<<<<< HEAD:client/src/user_side/pages/NewArrivals.tsx
import { useRef, useState } from "react";
import { useNewArrivalsQuery } from "../../queries/productQueries";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../component/ProductCard";
import { ProductCardSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../component/QuickViewModal";
=======
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchNewArrivals } from "../../redux/thunks/ProductThunk";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddToCartButton from "../../components/user/AddToCartButton";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/NewArrivals.tsx

const NewArrivals = () => {
  const { data: newArrivals = [], isLoading, error } = useNewArrivalsQuery();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll controls
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeftPos = scrollRef.current.scrollLeft;
      const cardWidth = 280 + 24; // Card width + gap
      const index = Math.round(scrollLeftPos / cardWidth);
      setActiveIndex(index);
    }
  };

  if (error) {
    return (
      <div className="mt-12 p-6 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-center text-rose-500">
        Error loading new arrivals. Please try again.
      </div>
    );
  }

  return (
<<<<<<< HEAD:client/src/user_side/pages/NewArrivals.tsx
    <div className="rounded-3xl p-8 border border-neutral-100 dark:border-neutral-900 bg-white/40 dark:bg-neutral-950/20 backdrop-blur-md relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-bold uppercase">
            Fresh Releases
          </span>
          <h2 className="text-3xl font-light tracking-wide text-neutral-900 dark:text-white mt-1">
            New Arrivals
          </h2>
        </div>

        <Link
          to="/web/all-products"
          state={{ category: "newArrival" }}
          className="text-xs tracking-wider uppercase font-semibold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300 border-b border-neutral-300 dark:border-neutral-700 pb-0.5"
=======
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
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/NewArrivals.tsx
        >
          View More
        </Link>
      </div>

<<<<<<< HEAD:client/src/user_side/pages/NewArrivals.tsx
      {/* Navigation Arrows */}
      {newArrivals.length > 0 && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-neutral-900 p-3 rounded-full shadow-lg border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-white transition duration-300 backdrop-blur-md"
            aria-label="Scroll Left"
=======
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
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/NewArrivals.tsx
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-neutral-900 p-3 rounded-full shadow-lg border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-white transition duration-300 backdrop-blur-md"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Scroll Wrapper */}
      {isLoading ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="min-w-[280px] max-w-[280px]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-6"
        >
          {newArrivals.map((product) => (
            <div key={product.id} className="min-w-[280px] max-w-[280px] flex-shrink-0">
              <ProductCard
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            </div>
          ))}

<<<<<<< HEAD:client/src/user_side/pages/NewArrivals.tsx
          {newArrivals.length === 0 && (
            <div className="text-center text-neutral-400 py-10 w-full">
              No new arrivals at this time.
            </div>
          )}
        </div>
      )}
=======
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
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/NewArrivals.tsx

      {/* Dot Indicators */}
      {!isLoading && newArrivals.length > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          {newArrivals.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollRef.current) {
                  const cardWidth = 280 + 24;
                  scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
                }
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 bg-black dark:bg-white"
                  : "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

<<<<<<< HEAD:client/src/user_side/pages/NewArrivals.tsx
      {/* Quick View Drawer */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
=======
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
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/NewArrivals.tsx
    </div>
  );
};

export default NewArrivals;
