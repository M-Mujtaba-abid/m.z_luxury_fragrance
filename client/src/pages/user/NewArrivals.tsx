import { useRef, useState } from "react";
import { useNewArrivalsQuery } from "../../queries/productQueries";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../components/user/ProductCard";
import { ProductCardSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../../components/user/QuickViewModal";

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
      <div className="mt-12 p-6 bg-red-950/40 border border-red-900/50 rounded-2xl text-center text-red-300">
        Error loading new arrivals. Please try again.
      </div>
    );
  }

  return (
    <div className="relative mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.2em] text-luxury-gold font-bold uppercase">
            Fresh Releases
          </span>
          <h2 className="font-logo text-3xl font-light tracking-wide text-white mt-1">
            New Arrivals
          </h2>
        </div>

        <Link
          to="/web/all-products"
          state={{ category: "newArrival" }}
          className="text-xs tracking-wider uppercase font-semibold text-luxury-gold hover:text-luxury-gold-bright transition-colors duration-300 border-b border-luxury-gold/30 pb-0.5"
        >
          View More
        </Link>
      </div>

      {/* Navigation Arrows */}
      {newArrivals.length > 0 && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-luxury-elevated/80 hover:bg-luxury-elevated p-3 rounded-full shadow-lg border border-luxury-gold/20 text-luxury-cream transition-colors duration-300 backdrop-blur-md"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-luxury-elevated/80 hover:bg-luxury-elevated p-3 rounded-full shadow-lg border border-luxury-gold/20 text-luxury-cream transition-colors duration-300 backdrop-blur-md"
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

          {newArrivals.length === 0 && (
            <div className="text-center text-luxury-cream/50 py-10 w-full">
              No new arrivals at this time.
            </div>
          )}
        </div>
      )}

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
                  ? "w-6 bg-luxury-gold"
                  : "bg-luxury-cream/20 hover:bg-luxury-cream/40"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Quick View Drawer */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default NewArrivals;
