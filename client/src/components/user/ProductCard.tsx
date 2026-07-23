import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, ArrowRightLeft, Star, ShoppingBag } from "lucide-react";
import type { Product } from "../../redux/types/productTypes";
import { ImageLoader } from "../ui/ImageLoader";
import { useWishlist } from "../../hooks/useWishlist";
import { useCompare } from "../../hooks/useCompare";
import { MAX_COMPARE_ITEMS } from "../../queries/compareQueries";
import { useCart } from "../../hooks/useCart";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "../../lib/queryOptions";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleWishlist, loadingId } = useWishlist();
  const {
    isComparing,
    toggleCompare,
    loadingId: compareLoadingId,
    isFull: isCompareFull,
  } = useCompare();

  const queryClient = useQueryClient();
  const prefetchProduct = () => {
    queryClient.prefetchQuery(queryOptions.single(product.id));
  };
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = isFavorite(product.id);
  const isWishlistBusy = loadingId === product.id;

  const isCompared = isComparing(product.id);
  const isCompareBusy = compareLoadingId === product.id;
  const compareDisabled = isCompareBusy || (isCompareFull && !isCompared);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.title} added to cart`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlistBusy) return;
    toggleWishlist(product.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compareDisabled) return;
    toggleCompare(product.id);
  };

  // Badges
  const showSaleBadge = product.isOnSale && product.discountPrice;
  const showNewBadge = product.isNewArrival;
  const showFeaturedBadge = product.isFeatured;

  // Inventory logic
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-luxury-gold/10 bg-luxury-card shadow-sm hover:border-luxury-gold/30 hover:shadow-xl transition-all duration-500 ease-out"
    >
      <Link to={product.slug ? `/product/${product.slug}` : `/product-detail/${product.id}`}
        onMouseEnter={prefetchProduct}
        onFocus={prefetchProduct}
        className="block flex-grow">
        {/* Badges Container */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {showSaleBadge && (
            <span className="px-2.5 py-0.5 text-[10px] tracking-wider font-bold bg-red-500 text-white rounded-full uppercase">
              Sale
            </span>
          )}
          {showNewBadge && (
            <span className="px-2.5 py-0.5 text-[10px] tracking-wider font-bold bg-emerald-500 text-white rounded-full uppercase">
              New
            </span>
          )}
          {showFeaturedBadge && (
            <span className="px-2.5 py-0.5 text-[10px] tracking-wider font-bold bg-luxury-gold text-luxury-ink rounded-full uppercase">
              Featured
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3] rounded-t-2xl">
          <ImageLoader
            src={product.productImage}
            alt={product.title}
            aspectRatio="aspect-full"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Subtle vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Quick Action Side Buttons */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              disabled={isWishlistBusy}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors duration-300 shadow-md disabled:cursor-wait ${isWishlisted
                ? "bg-red-500 text-white"
                : "bg-luxury-elevated/80 text-luxury-cream hover:bg-red-500 hover:text-white"
                }`}
              title="Add to Wishlist"
            >
              {isWishlistBusy ? (
                <div className="w-[15px] h-[15px] border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
              )}
            </button>
            <button
              onClick={handleCompare}
              disabled={compareDisabled}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors duration-300 shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${isCompared
                ? "bg-blue-600 text-white"
                : "bg-luxury-elevated/80 text-luxury-cream hover:bg-blue-600 hover:text-white"
                }`}
              title={
                isCompareFull && !isCompared
                  ? `You can only compare up to ${MAX_COMPARE_ITEMS} products`
                  : "Compare Product"
              }
            >
              {isCompareBusy ? (
                <div className="w-[15px] h-[15px] border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRightLeft size={15} />
              )}
            </button>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="p-2.5 rounded-full bg-luxury-elevated/80 text-luxury-cream hover:bg-luxury-gold hover:text-luxury-ink backdrop-blur-md transition-colors duration-300 shadow-md"
                title="Quick View"
              >
                <Eye size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 space-y-2 flex-grow">
          {/* Category & Ratings Row */}
          <div className="flex justify-between items-center text-[11px] text-luxury-cream/60 tracking-widest uppercase">
            <span>{product.category}</span>
            <div className="flex items-center gap-0.5">
              <Star size={10} className="fill-luxury-gold stroke-luxury-gold" />
              <span className="font-semibold text-luxury-cream/80 ml-0.5">
                4.8
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-logo text-base font-light text-luxury-cream tracking-wide truncate group-hover:text-luxury-gold-bright transition-colors duration-300">
            {product.title}
          </h3>

          {/* Size Variant Tag */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 border border-luxury-gold/20 rounded bg-luxury-ink font-medium text-luxury-cream/70">
              {product.Quantity || "50ML"}
            </span>
            <span className="text-[10px] text-luxury-cream/40">Standard Pack</span>
          </div>

          {/* Pricing & Stock Status */}
          <div className="flex justify-between items-end pt-1">
            <div className="flex flex-col">
              {showSaleBadge ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-400">
                    Rs. {product.discountPrice}
                  </span>
                  <span className="text-xs text-luxury-cream/40 line-through">
                    Rs. {product.price}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-semibold text-luxury-gold">
                  Rs. {product.price}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="text-[10px] uppercase tracking-wider font-medium">
              {isOutOfStock ? (
                <span className="text-red-400 font-bold">Sold Out</span>
              ) : isLowStock ? (
                <span className="text-amber-400 animate-pulse">Only {product.stock} Left</span>
              ) : (
                <span className="text-emerald-400">In Stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Action Button at bottom */}
      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={isOutOfStock || isAdding}
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 border font-medium text-xs tracking-widest uppercase transition-all duration-300 ${isOutOfStock
            ? "bg-luxury-ink border-luxury-gold/10 text-luxury-cream/30 cursor-not-allowed"
            : "bg-luxury-gold border-transparent text-luxury-ink hover:bg-luxury-gold-bright shadow-md hover:shadow-lg"
            }`}
        >
          {isAdding ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingBag size={13} />
              <span>Add to Cart</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
export default ProductCard;
