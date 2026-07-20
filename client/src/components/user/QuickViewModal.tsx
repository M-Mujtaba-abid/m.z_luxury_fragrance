import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, CreditCard, Heart, ArrowRightLeft } from "lucide-react";
import type { Product } from "../../redux/types/productTypes";
import { ImageLoader } from "../ui/ImageLoader";
import { useWishlist } from "../../hooks/useWishlist";
import { useCompare } from "../../hooks/useCompare";
import { MAX_COMPARE_ITEMS } from "../../queries/compareQueries";
import { useCart } from "../../hooks/useCart";
import toast from "react-hot-toast";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "shipping" | "returns">("description");

  const { isFavorite, toggleWishlist, loadingId: wishlistLoadingId } = useWishlist();
  const {
    isComparing,
    toggleCompare,
    loadingId: compareLoadingId,
    isFull: isCompareFull,
  } = useCompare();

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.Quantity || "50ML");
      setSelectedQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const isWishlisted = isFavorite(product.id);
  const isWishlistBusy = wishlistLoadingId === product.id;
  const isCompared = isComparing(product.id);
  const isCompareBusy = compareLoadingId === product.id;
  const compareDisabled = isCompareBusy || (isCompareFull && !isCompared);

  // Price calculations
  let basePrice = product.price;
  let displayPrice = basePrice;
  if (product.isOnSale && product.discountPrice) {
    displayPrice = product.discountPrice;
  }

  // Adjust price dynamically based on size selection
  if (selectedSize === "15ML") {
    displayPrice = Math.round(displayPrice * 0.4);
    basePrice = Math.round(basePrice * 0.4);
  } else if (selectedSize === "50ML") {
    displayPrice = Math.round(displayPrice * 0.75);
    basePrice = Math.round(basePrice * 0.75);
  }

  const handleAddToCart = async (checkoutAfter = false) => {
    setIsAdding(!checkoutAfter);
    setIsBuyingNow(checkoutAfter);
    try {
      await addToCart(product.id, selectedQuantity);
      toast.success(`${product.title} added to cart!`);
      if (checkoutAfter) {
        onClose();
        navigate("/web/checkout");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
      setIsBuyingNow(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Container Drawer */}
          <div
            className="relative w-full max-w-5xl h-[90vh] md:h-auto max-h-[85vh] bg-luxury-elevated border border-luxury-gold/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-20 p-2 rounded-full bg-luxury-ink text-luxury-cream/70 hover:text-luxury-gold transition-colors duration-300"
            >
              <X size={18} />
            </button>

            {/* Left Side: Images & Zoom Panel */}
            <div className="w-full md:w-1/2 bg-luxury-ink p-6 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="relative aspect-square w-full max-w-[380px] group cursor-zoom-in overflow-hidden rounded-2xl">
                <ImageLoader
                  src={product.productImage}
                  alt={product.title}
                  aspectRatio="aspect-square"
                  className="w-full h-full object-cover transform hover:scale-125 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Badges */}
              <div className="absolute left-6 top-6 flex flex-col gap-1.5 pointer-events-none">
                {product.isOnSale && (
                  <span className="px-3 py-1 text-[9px] tracking-widest font-bold bg-red-500 text-white rounded-full uppercase">
                    Sale
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 text-[9px] tracking-widest font-bold bg-luxury-gold text-luxury-ink rounded-full uppercase">
                    Signature
                  </span>
                )}
              </div>

              {/* Wishlist / Compare quick actions - top-16 keeps clear of the modal's own close (X) button, which shares this corner on the stacked mobile layout */}
              <div className="absolute right-6 top-16 flex flex-col gap-2">
                <button
                  onClick={() => !isWishlistBusy && toggleWishlist(product.id)}
                  disabled={isWishlistBusy}
                  title="Add to Wishlist"
                  className={`p-2.5 rounded-full backdrop-blur-md transition-colors duration-300 shadow-md disabled:cursor-wait ${
                    isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-luxury-elevated/80 text-luxury-cream hover:bg-red-500 hover:text-white"
                  }`}
                >
                  {isWishlistBusy ? (
                    <div className="w-[15px] h-[15px] border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
                  )}
                </button>

                <button
                  onClick={() => !compareDisabled && toggleCompare(product.id)}
                  disabled={compareDisabled}
                  title={
                    isCompareFull && !isCompared
                      ? `You can only compare up to ${MAX_COMPARE_ITEMS} products`
                      : "Compare Product"
                  }
                  className={`p-2.5 rounded-full backdrop-blur-md transition-colors duration-300 shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${
                    isCompared
                      ? "bg-blue-600 text-white"
                      : "bg-luxury-elevated/80 text-luxury-cream hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {isCompareBusy ? (
                    <div className="w-[15px] h-[15px] border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRightLeft size={15} />
                  )}
                </button>
              </div>
            </div>

            {/* Right Side: Configuration & Controls */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto h-full">
              <div className="space-y-6">
                {/* Meta details & reviews */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs tracking-widest text-luxury-cream/50 uppercase">
                    <span>{product.category} COLLECTION</span>
                    <div className="flex items-center gap-1">
                      <div className="flex text-luxury-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" className="stroke-none" />
                        ))}
                      </div>
                      <span className="font-semibold text-luxury-cream/80">
                        4.8 (42 Reviews)
                      </span>
                    </div>
                  </div>

                  <h2 className="font-logo text-2xl font-light text-luxury-cream tracking-wide">
                    {product.title}
                  </h2>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-luxury-gold">
                    Rs. {displayPrice}
                  </span>
                  {product.isOnSale && product.discountPrice && (
                    <span className="text-sm text-luxury-cream/40 line-through">
                      Rs. {product.price}
                    </span>
                  )}
                  <span className="text-xs text-emerald-400 font-medium ml-2">
                    {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
                  </span>
                </div>

                {/* Options selectors */}
                <div className="space-y-4 pt-2 border-t border-luxury-gold/10">
                  {/* Size Selector */}
                  <div>
                    <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                      Select Size
                    </span>
                    <div className="flex gap-3">
                      {["15ML", "50ML"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-xs font-semibold tracking-wider rounded-lg border transition-all duration-300 ${
                            selectedSize === size
                              ? "bg-luxury-gold text-luxury-ink border-transparent shadow-sm"
                              : "border-luxury-gold/20 hover:border-luxury-gold/50 text-luxury-cream/70 bg-transparent"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div>
                    <span className="text-xs tracking-widest text-luxury-cream/50 uppercase block mb-2">
                      Quantity
                    </span>
                    <div className="inline-flex items-center border border-luxury-gold/20 rounded-lg overflow-hidden bg-luxury-ink">
                      <button
                        onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                        className="px-3.5 py-1.5 text-luxury-cream/60 hover:text-luxury-gold transition-colors duration-300"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-semibold text-luxury-cream">
                        {selectedQuantity}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedQuantity(Math.min(product.stock, selectedQuantity + 1))
                        }
                        className="px-3.5 py-1.5 text-luxury-cream/60 hover:text-luxury-gold transition-colors duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs for detailed content */}
                <div>
                  <div className="flex border-b border-luxury-gold/10">
                    {["description", "shipping", "returns"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-2 pr-6 text-xs uppercase tracking-wider font-semibold transition-colors duration-300 ${
                          activeTab === tab
                            ? "text-luxury-gold border-b-2 border-luxury-gold"
                            : "text-luxury-cream/50 hover:text-luxury-cream/70"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="py-4 text-xs leading-relaxed text-luxury-cream/70">
                    {activeTab === "description" && (
                      <p>{product.description || "A luxury, masterfully formulated fragrance blending rare, selected botanicals. Creates a long-lasting, sophisticated sensory footprint."}</p>
                    )}
                    {activeTab === "shipping" && (
                      <p>Complimentary premium worldwide delivery on orders above Rs. 5000. Delivered in signature handcrafted satin wrapping. Arrives in 2-4 business days.</p>
                    )}
                    {activeTab === "returns" && (
                      <p>Due to the personal nature of our perfumery blends, we offer complimentary sample packs with purchases. Unopened full products can be returned within 14 days.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions & checkout triggers */}
              <div className="space-y-3 pt-6 border-t border-luxury-gold/10">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(false)}
                    disabled={product.stock <= 0 || isAdding}
                    className="flex-1 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    {isAdding ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={product.stock <= 0 || isBuyingNow}
                    className="flex-1 py-3 bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    {isBuyingNow ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard size={14} />
                        <span>Buy Now</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-center text-luxury-cream/50">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-luxury-ink">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-luxury-ink">
                    <Truck size={14} className="text-blue-400" />
                    <span>Signature Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-luxury-ink">
                    <RefreshCw size={14} className="text-luxury-gold" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default QuickViewModal;
