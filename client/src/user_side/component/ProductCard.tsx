import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, ArrowRightLeft, Star, ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/user/cart/CartThunk";
import type { AppDispatch } from "../../redux/store";
import type { Product } from "../../redux/Admin/typesAdminComponent/productTypes";
import { ImageLoader } from "../../components/ui/ImageLoader";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success(`${product.title} added to cart`);
    } catch (error: any) {
      toast.error(error || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      { icon: "❤️" }
    );
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCompared(!isCompared);
    toast.success(
      isCompared ? "Removed from Compare" : "Added to Compare list",
      { icon: "🔄" }
    );
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 dark:border-neutral-900 bg-white/40 dark:bg-black/20 backdrop-blur-md shadow-sm hover:shadow-xl dark:hover:shadow-neutral-950/50 transition-all duration-500 ease-out"
    >
      <Link to={`/web/product-detail/${product.id}`} className="block flex-grow">
        {/* Badges Container */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {showSaleBadge && (
            <span className="px-2.5 py-0.5 text-[10px] tracking-wider font-bold bg-rose-500 text-white rounded-full uppercase">
              Sale
            </span>
          )}
          {showNewBadge && (
            <span className="px-2.5 py-0.5 text-[10px] tracking-wider font-bold bg-emerald-500 text-white rounded-full uppercase">
              New
            </span>
          )}
          {showFeaturedBadge && (
            <span className="px-2.5 py-0.5 text-[10px] tracking-wider font-bold bg-amber-500 text-white rounded-full uppercase">
              Featured
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/5] rounded-t-2xl">
          <ImageLoader
            src={product.productImage}
            alt={product.title}
            aspectRatio="aspect-full"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          
          {/* Subtle vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Quick Action Side Buttons */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors duration-300 shadow-md ${
                isWishlisted
                  ? "bg-rose-500 text-white"
                  : "bg-white/80 dark:bg-black/70 text-neutral-800 dark:text-white hover:bg-rose-500 hover:text-white"
              }`}
              title="Add to Wishlist"
            >
              <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleCompare}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors duration-300 shadow-md ${
                isCompared
                  ? "bg-blue-600 text-white"
                  : "bg-white/80 dark:bg-black/70 text-neutral-800 dark:text-white hover:bg-blue-600 hover:text-white"
              }`}
              title="Compare Product"
            >
              <ArrowRightLeft size={15} />
            </button>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="p-2.5 rounded-full bg-white/80 dark:bg-black/70 text-neutral-800 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black backdrop-blur-md transition-colors duration-300 shadow-md"
                title="Quick View"
              >
                <Eye size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-5 space-y-3 flex-grow">
          {/* Category & Ratings Row */}
          <div className="flex justify-between items-center text-[11px] text-neutral-500 dark:text-neutral-400 tracking-widest uppercase">
            <span>{product.category}</span>
            <div className="flex items-center gap-0.5">
              <Star size={10} className="fill-amber-400 stroke-amber-400" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 ml-0.5">
                4.8
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-light text-neutral-900 dark:text-white tracking-wide truncate group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-300">
            {product.title}
          </h3>

          {/* Size Variant Tag */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50 dark:bg-neutral-900 font-medium text-neutral-600 dark:text-neutral-400">
              {product.Quantity || "100ML"}
            </span>
            <span className="text-[10px] text-neutral-400">Standard Pack</span>
          </div>

          {/* Pricing & Stock Status */}
          <div className="flex justify-between items-end pt-1">
            <div className="flex flex-col">
              {showSaleBadge ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-rose-500">
                    Rs. {product.discountPrice}
                  </span>
                  <span className="text-xs text-neutral-400 line-through">
                    Rs. {product.price}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  Rs. {product.price}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="text-[10px] uppercase tracking-wider font-medium">
              {isOutOfStock ? (
                <span className="text-rose-500 font-bold">Sold Out</span>
              ) : isLowStock ? (
                <span className="text-amber-500 animate-pulse">Only {product.stock} Left</span>
              ) : (
                <span className="text-emerald-500">In Stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Action Button at bottom */}
      <div className="px-5 pb-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={isOutOfStock || isAdding}
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 border font-medium text-xs tracking-widest uppercase transition-all duration-300 ${
            isOutOfStock
              ? "bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 cursor-not-allowed"
              : "bg-black dark:bg-white text-white dark:text-black border-transparent hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md hover:shadow-lg"
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
