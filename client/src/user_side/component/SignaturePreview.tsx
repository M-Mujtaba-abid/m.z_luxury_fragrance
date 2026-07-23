import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Star, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useFeaturedProductsQuery } from "../../queries/productQueries";
import { useCart } from "../../hooks/useCart";
import { ImageLoader } from "../../components/ui/ImageLoader";
import toast from "react-hot-toast";

export const SignaturePreview: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: featuredProducts, isLoading } = useFeaturedProductsQuery();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const product = featuredProducts?.[0];

  if (isLoading) {
    return (
      <div className="mt-16 rounded-[40px] p-8 md:p-16 border border-luxury-gold/10 bg-luxury-card animate-pulse h-[400px]" />
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const displayPrice =
    product.isOnSale && product.discountPrice ? product.discountPrice : product.price;

  const handleAddToCart = async (checkoutNow = false) => {
    checkoutNow ? setIsBuyingNow(true) : setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.title} added to cart!`);
      if (checkoutNow) {
        navigate("/checkout");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="mt-10 rounded-[40px] p-4 md:p-8 border border-luxury-gold/10 bg-luxury-card backdrop-blur-md overflow-hidden lg:h-[500px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center lg:h-full">

        {/* Left Side: Product Gallery */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center lg:h-full">
          <Link
            to={product.slug ? `/product/${product.slug}` : `/product-detail/${product.id}`}
            className="relative aspect-square lg:aspect-auto w-full max-w-[380px] lg:h-full lg:max-h-[420px] mx-auto overflow-hidden rounded-3xl group bg-luxury-ink shadow-sm border border-luxury-gold/10 block"
          >
            <ImageLoader
              src={product.productImage}
              alt={product.title}
              aspectRatio="aspect-full"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute right-4 bottom-4 bg-luxury-ink/80 backdrop-blur-md px-3 py-2 rounded-full text-[10px] tracking-widest text-luxury-cream uppercase font-light">
              View Details
            </div>
          </Link>
        </div>

        {/* Right Side: Options & Direct Purchase */}
        <div className="lg:col-span-6 space-y-3 lg:h-full lg:max-h-full lg:overflow-y-auto lg:pr-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[9px] tracking-widest font-bold bg-luxury-gold text-luxury-ink rounded-full uppercase">
                Signature Collection
              </span>
              <div className="flex text-luxury-gold items-center gap-0.5">
                <Star size={12} fill="currentColor" className="stroke-none" />
                <span className="text-xs text-luxury-cream font-semibold ml-0.5">
                  {(product.averageRating ?? 4.8).toFixed(1)} ({product.reviewCount ?? 0} Reviews)
                </span>
              </div>
            </div>
            <h2 className="font-logo text-2xl sm:text-3xl font-light text-luxury-cream tracking-wide">
              {product.title}
            </h2>
          </div>

          <p className="text-sm text-luxury-cream/70 leading-relaxed font-light line-clamp-2">
            {product.description}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-1 flex-wrap">
            <span className="text-3xl font-semibold text-luxury-gold">
              Rs. {displayPrice}
            </span>
            {product.isOnSale && product.discountPrice && (
              <span className="text-sm text-luxury-cream/40 line-through">
                Rs. {product.price}
              </span>
            )}
            <span
              className={`text-xs font-medium ml-2 ${isOutOfStock ? "text-red-400" : "text-emerald-400"
                }`}
            >
              {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock} left)`}
            </span>
          </div>

          {/* Selection configuration */}
          <div className="flex items-start gap-8 pt-3 border-t border-luxury-gold/10">
            {/* Size / Volume */}
            <div>
              <span className="text-xs uppercase tracking-widest text-luxury-cream/50 font-semibold block mb-1.5">
                Size / Volume
              </span>
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider rounded-lg border border-luxury-gold/20 bg-luxury-ink text-luxury-cream/80">
                {product.Quantity || "50ML"}
              </span>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-xs uppercase tracking-widest text-luxury-cream/50 font-semibold block mb-1.5">
                Quantity
              </span>
              <div className="inline-flex items-center border border-luxury-gold/20 rounded-lg overflow-hidden bg-luxury-ink">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1 text-luxury-cream/60 hover:text-luxury-gold transition-colors duration-300"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-luxury-cream">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-1 text-luxury-cream/60 hover:text-luxury-gold transition-colors duration-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <div className="flex gap-4">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={isOutOfStock || isAdding}
                className="flex-1 py-2.5 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                disabled={isOutOfStock || isBuyingNow}
                className="flex-1 py-2.5 bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isBuyingNow ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-center text-luxury-cream/50">
              <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-luxury-ink border border-luxury-gold/10">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Secure SSL Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-luxury-ink border border-luxury-gold/10">
                <Truck size={13} className="text-blue-400" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-luxury-ink border border-luxury-gold/10">
                <RefreshCw size={13} className="text-luxury-gold" />
                <span>Easy Exchange Sizing</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignaturePreview;
