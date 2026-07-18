import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-square",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-luxury-card rounded-xl`}>
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-tr from-luxury-ink to-luxury-card animate-pulse flex items-center justify-center"
          >
            {/* Elegant luxury micro-icon or logo representation */}
            <span className="text-[10px] tracking-widest text-luxury-gold/40 uppercase font-light">
              M.Z LUXURY
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-luxury-card text-luxury-cream/40">
          <span className="text-xs font-light">Image Unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-md"
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
};
