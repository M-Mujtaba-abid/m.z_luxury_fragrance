import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn } from "lucide-react";

export interface GalleryImage {
  id: number | string;
  url: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  title: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const safeImages = images.length > 0 ? images : [{ id: "placeholder", url: "" }];
  const active = safeImages[activeIndex] ?? safeImages[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [images.length]);

  const goTo = (index: number) => {
    setActiveIndex((index + safeImages.length) % safeImages.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      goTo(activeIndex + (deltaX < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, activeIndex]);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] pb-1 sm:pb-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
          {safeImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => goTo(index)}
              aria-label={`View image ${index + 1} of ${title}`}
              aria-current={index === activeIndex}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors duration-300 ${
                index === activeIndex
                  ? "border-luxury-gold"
                  : "border-luxury-gold/10 hover:border-luxury-gold/40"
              }`}
            >
              <img
                src={img.url}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main viewer */}
      <div className="relative flex-1 group">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-2xl border border-luxury-gold/15 bg-luxury-card cursor-zoom-in"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active.id}
              src={active.url}
              alt={title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-300 ease-out"
              style={
                isZooming
                  ? { transform: "scale(1.8)", transformOrigin: zoomOrigin }
                  : undefined
              }
            />
          </AnimatePresence>

          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-luxury-ink/70 text-luxury-cream/80 text-[10px] uppercase tracking-widest backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn size={12} />
            <span>Hover to zoom</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            aria-label="Open full-screen view"
            className="absolute top-3 right-3 p-2 rounded-full bg-luxury-ink/70 text-luxury-cream hover:text-luxury-gold backdrop-blur-sm transition-colors duration-300"
          >
            <Expand size={16} />
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex - 1);
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-luxury-ink/70 text-luxury-cream hover:text-luxury-gold backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex + 1);
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-luxury-ink/70 text-luxury-cream hover:text-luxury-gold backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-10"
            onClick={() => setIsLightboxOpen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close full-screen view"
              className="absolute right-5 top-5 p-2.5 rounded-full bg-luxury-card text-luxury-cream hover:text-luxury-gold transition-colors duration-300"
            >
              <X size={20} />
            </button>

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex - 1);
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-luxury-card/80 text-luxury-cream hover:text-luxury-gold transition-colors duration-300"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex + 1);
                  }}
                  aria-label="Next image"
                  className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-luxury-card/80 text-luxury-cream hover:text-luxury-gold transition-colors duration-300"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.img
              key={active.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={active.url}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-luxury-cream/60 tracking-widest uppercase">
              {activeIndex + 1} / {safeImages.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;
