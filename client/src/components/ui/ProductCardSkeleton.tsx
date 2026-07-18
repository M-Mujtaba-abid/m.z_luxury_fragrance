import React from "react";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="relative border border-luxury-gold/10 rounded-2xl overflow-hidden bg-luxury-card/60 backdrop-blur-md shadow-sm p-4 flex flex-col space-y-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-80 bg-luxury-elevated rounded-xl" />

      {/* Content Skeleton */}
      <div className="flex-grow space-y-3">
        {/* Title */}
        <div className="h-4 bg-luxury-elevated rounded-md w-3/4" />
        {/* Volume/Weight */}
        <div className="h-3 bg-luxury-elevated rounded-md w-1/4" />
        {/* Price */}
        <div className="h-5 bg-luxury-elevated rounded-md w-1/3" />
      </div>

      {/* Button Skeleton */}
      <div className="h-10 bg-luxury-elevated rounded-lg w-full" />
    </div>
  );
};

export const ProductsGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};
