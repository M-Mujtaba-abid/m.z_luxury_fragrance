import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, CreditCard } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/thunks/CartThunk";
import type { AppDispatch } from "../../redux/store";
import type { Product } from "../../redux/types/productTypes";
import { ImageLoader } from "../ui/ImageLoader";
import toast from "react-hot-toast";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "shipping" | "returns">("description");

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.Quantity || "100ML");
      setSelectedQuantity(1);
    }
  }, [product]);

  if (!product) return null;

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
      await dispatch(
        addToCart({ productId: product.id, quantity: selectedQuantity })
      ).unwrap();
      
      toast.success(`${product.title} added to cart!`);
      
      if (checkoutAfter) {
        onClose();
        navigate("/web/checkout");
      }
    } catch (error: any) {
      toast.error(error || "Failed to add to cart");
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
            className="relative w-full max-w-5xl h-[90vh] md:h-auto max-h-[85vh] bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-20 p-2 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors duration-300"
            >
              <X size={18} />
            </button>

            {/* Left Side: Images & Zoom Panel */}
            <div className="w-full md:w-1/2 bg-neutral-50 dark:bg-neutral-900 p-6 flex flex-col justify-center items-center relative overflow-hidden">
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
                  <span className="px-3 py-1 text-[9px] tracking-widest font-bold bg-rose-500 text-white rounded-full uppercase">
                    Sale
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 text-[9px] tracking-widest font-bold bg-amber-500 text-white rounded-full uppercase">
                    Signature
                  </span>
                )}
              </div>
            </div>

            {/* Right Side: Configuration & Controls */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto h-full">
              <div className="space-y-6">
                {/* Meta details & reviews */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                    <span>{product.category} COLLECTION</span>
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" className="stroke-none" />
                        ))}
                      </div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        4.8 (42 Reviews)
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-light text-neutral-900 dark:text-white tracking-wide">
                    {product.title}
                  </h2>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
                    Rs. {displayPrice}
                  </span>
                  {product.isOnSale && product.discountPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      Rs. {product.price}
                    </span>
                  )}
                  <span className="text-xs text-emerald-500 font-medium ml-2">
                    {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
                  </span>
                </div>

                {/* Options selectors */}
                <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-900">
                  {/* Size Selector */}
                  <div>
                    <span className="text-xs tracking-widest text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
                      Select Size
                    </span>
                    <div className="flex gap-3">
                      {["15ML", "50ML", "100ML"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-xs font-semibold tracking-wider rounded-lg border transition-all duration-300 ${
                            selectedSize === size
                              ? "bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-700 dark:text-neutral-300 bg-transparent"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div>
                    <span className="text-xs tracking-widest text-neutral-400 dark:text-neutral-500 uppercase block mb-2">
                      Quantity
                    </span>
                    <div className="inline-flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-900/50">
                      <button
                        onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                        className="px-3.5 py-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {selectedQuantity}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedQuantity(Math.min(product.stock, selectedQuantity + 1))
                        }
                        className="px-3.5 py-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs for detailed content */}
                <div>
                  <div className="flex border-b border-neutral-100 dark:border-neutral-900">
                    {["description", "shipping", "returns"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-2 pr-6 text-xs uppercase tracking-wider font-semibold transition-colors duration-300 ${
                          activeTab === tab
                            ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                            : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="py-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
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
              <div className="space-y-3 pt-6 border-t border-neutral-100 dark:border-neutral-900">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(false)}
                    disabled={product.stock <= 0 || isAdding}
                    className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300"
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
                    className="flex-1 py-3 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300"
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
                <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-center text-neutral-400 dark:text-neutral-500">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                    <Truck size={14} className="text-blue-500" />
                    <span>Signature Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                    <RefreshCw size={14} className="text-amber-500" />
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
