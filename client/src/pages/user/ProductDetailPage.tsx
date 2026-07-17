import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
<<<<<<< HEAD:client/src/user_side/pages/ProductDetailPage.tsx
import { useSingleProductQuery } from "../../queries/productQueries";
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/user/cart/CartThunk";
import type { AppDispatch } from "../../redux/store";
import { ImageLoader } from "../../components/ui/ImageLoader";
import toast from "react-hot-toast";
import SEO from "../../components/ui/SEO";
=======
import { getProductById } from "../../redux/thunks/ProductThunk";
import {
  clearError,
  clearCurrentProduct,
} from "../../redux/slices/ProductSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import AddToCartButton from "../../components/user/AddToCartButton";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/ProductDetailPage.tsx

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { data: currentProduct, isLoading, error } = useSingleProductQuery(
    productId ? parseInt(productId) : undefined
  );

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "notes" | "shipping">("description");

  // Set default size when currentProduct is loaded
  useEffect(() => {
    if (currentProduct) {
      setSelectedSize(currentProduct.Quantity || "100ML");
    }
  }, [currentProduct]);

  if (isLoading) {
    return (
<<<<<<< HEAD:client/src/user_side/pages/ProductDetailPage.tsx
      <div className="min-h-screen pt-24 bg-white dark:bg-neutral-950 flex flex-col justify-center items-center">
        <div className="space-y-4 w-full max-w-4xl px-4 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-3xl h-[450px]" />
            <div className="space-y-6">
              <div className="h-4 bg-neutral-100 dark:bg-neutral-900 rounded-md w-1/4" />
              <div className="h-8 bg-neutral-100 dark:bg-neutral-900 rounded-md w-3/4" />
              <div className="h-6 bg-neutral-100 dark:bg-neutral-900 rounded-md w-1/3" />
              <div className="h-20 bg-neutral-100 dark:bg-neutral-900 rounded-md w-full" />
              <div className="h-12 bg-neutral-100 dark:bg-neutral-900 rounded-md w-full" />
            </div>
          </div>
=======
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-luxury-cream/70">
          Loading product details...
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/ProductDetailPage.tsx
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
<<<<<<< HEAD:client/src/user_side/pages/ProductDetailPage.tsx
      <div className="min-h-screen pt-24 bg-white dark:bg-neutral-950 flex flex-col justify-center items-center px-4">
        <h2 className="text-2xl font-light text-rose-500 mb-4">Fragrance Not Found</h2>
        <p className="text-neutral-500 text-sm mb-6 text-center max-w-sm">
          The perfume impression you are looking for is unavailable or has expired.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-semibold uppercase tracking-widest"
        >
          Return to Catalog
        </button>
=======
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-red-400">{error}</div>
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/ProductDetailPage.tsx
      </div>
    );
  }

<<<<<<< HEAD:client/src/user_side/pages/ProductDetailPage.tsx
  // Calculate pricing based on variants/sizes
  let basePrice = currentProduct.price;
  let displayPrice = basePrice;
  if (currentProduct.isOnSale && currentProduct.discountPrice) {
    displayPrice = currentProduct.discountPrice;
=======
  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-luxury-cream/70">
          Product not found
        </div>
      </div>
    );
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/ProductDetailPage.tsx
  }

  if (selectedSize === "15ML") {
    displayPrice = Math.round(displayPrice * 0.4);
    basePrice = Math.round(basePrice * 0.4);
  } else if (selectedSize === "50ML") {
    displayPrice = Math.round(displayPrice * 0.75);
    basePrice = Math.round(basePrice * 0.75);
  }

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(
        addToCart({ productId: currentProduct.id, quantity: selectedQuantity })
      ).unwrap();
      toast.success(`${currentProduct.title} added to cart`);
    } catch (err: any) {
      toast.error(err || "Failed to add product to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
<<<<<<< HEAD:client/src/user_side/pages/ProductDetailPage.tsx
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-12 md:py-24">
      <SEO
        title={currentProduct.title}
        description={currentProduct.description}
        ogImage={currentProduct.productImage}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": currentProduct.title,
          "image": currentProduct.productImage,
          "description": currentProduct.description,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "PKR",
            "price": displayPrice,
            "availability": currentProduct.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300 mb-8 pt-10 text-xs uppercase tracking-wider font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Back to Catalog</span>
        </button>

        {/* Core Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          
          {/* Left Column: Visual Panel */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full aspect-[4/5] bg-neutral-50 dark:bg-neutral-900 overflow-hidden rounded-3xl shadow-sm cursor-zoom-in relative">
              <ImageLoader
                src={currentProduct.productImage}
                alt={currentProduct.title}
                aspectRatio="aspect-full"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
              />
              
              {currentProduct.isFeatured && (
                <span className="absolute left-6 top-6 px-3 py-1 bg-amber-500/80 backdrop-blur text-[9px] font-bold tracking-widest text-white rounded-full uppercase">
                  Signature Blend
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Information Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Category & Rating */}
              <div className="flex justify-between items-center text-xs tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                <span>{currentProduct.category} COLLECTION</span>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" className="stroke-none" />
                    ))}
                  </div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    4.9
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white tracking-wide">
                  {currentProduct.title}
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                  {currentProduct.description || "A luxury, masterfully formulated fragrance blending rare, selected botanicals. Creates a long-lasting, sophisticated sensory footprint."}
                </p>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-semibold text-neutral-900 dark:text-white">
                  Rs. {displayPrice}
                </span>
                {currentProduct.isOnSale && currentProduct.discountPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    Rs. {currentProduct.price}
                  </span>
                )}
                <span className="text-xs text-emerald-500 font-medium ml-2">
                  {currentProduct.stock > 0 ? `In stock (${currentProduct.stock} units)` : "Sold Out"}
                </span>
              </div>

              {/* Size Selectors */}
              <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <span className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block">
                  Volume / Bottle Size
                </span>
                <div className="flex gap-3">
                  {["15ML", "50ML", "100ML"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 text-xs font-semibold tracking-wider rounded-xl border transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-black dark:bg-white text-white dark:text-black border-transparent shadow-md"
                          : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 bg-transparent hover:border-neutral-400"
=======
    <div className="min-h-screen py-8  bg-luxury-ink">
      <div className="max-w-4xl pt-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-luxury-ink border border-luxury-gold/10 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-luxury-gold/10">
            <div className="flex justify-between items-center">
              <h1 className="font-logo text-3xl font-bold text-luxury-cream">
                Product Details
              </h1>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-luxury-gold/20 bg-luxury-ink text-luxury-cream rounded-md transition-colors duration-300 hover:bg-luxury-gold/10 hover:text-luxury-gold"
              >
                Back
              </button>
            </div>
          </div>

          {/* Product Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-w-1 pt-10 aspect-h-1 w-full overflow-hidden rounded-lg border border-luxury-gold/15 bg-[#141414]">
                  <img
                    src={currentProduct.productImage}
                    alt={currentProduct.title}
                    className="w-full lg:h-[500px] object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-logo text-2xl font-bold text-luxury-cream mb-2">
                    {currentProduct.title}
                  </h2>
                  <p className="text-luxury-cream/70 text-lg leading-relaxed">
                    {currentProduct.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center justify-between p-4 bg-[#141414] border border-luxury-gold/10 rounded-lg">
                    <span className="text-lg font-semibold text-luxury-gold">
                      Price:
                    </span>
                    <span className="text-2xl font-bold text-luxury-cream">
                      Rs. {currentProduct.price}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-4 bg-[#141414] border border-luxury-gold/10 rounded-lg">
                    <span className="text-lg font-semibold text-luxury-gold">
                      Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentProduct.status === "available"
                          ? "bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30"
                          : "bg-red-950/40 text-red-300 border border-red-900/40"
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/ProductDetailPage.tsx
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

<<<<<<< HEAD:client/src/user_side/pages/ProductDetailPage.tsx
              {/* Quantity Stepper */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block">
                  Select Quantity
                </span>
                <div className="inline-flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900/50">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="px-4 py-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="px-5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedQuantity(
                        Math.min(currentProduct.stock, selectedQuantity + 1)
                      )
                    }
                    className="px-4 py-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Accordion Tabs */}
              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900">
                <div className="flex border-b border-neutral-100 dark:border-neutral-900">
                  {["description", "notes", "shipping"].map((tab) => (
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

                <div className="py-4 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {activeTab === "description" && (
                    <p>Designed for discerning customers, this impression replicates a bespoke olfactory composition. Every drop highlights standard concentration elements suited for formal, luxury, or casual wear.</p>
                  )}
                  {activeTab === "notes" && (
                    <p><strong>Top Notes:</strong> Calabrian Bergamot, Pink Pepper.<br /><strong>Heart Notes:</strong> Turkish Rose, Patchouli Leaf.<br /><strong>Base Notes:</strong> Amberwood, Mysore Sandalwood, White Musk.</p>
                  )}
                  {activeTab === "shipping" && (
                    <p>Delivered globally in discrete custom shockproof containers. Complete with personalized branding wrap and a complimentary mini-tester fragrance vial. Standard shipping is 2-4 days.</p>
=======
                  {/* Stock */}
                  <div className="flex items-center justify-between p-4 bg-[#141414] border border-luxury-gold/10 rounded-lg">
                    <span className="text-lg font-semibold text-luxury-gold">
                      Stock:
                    </span>
                    <span className="text-lg font-medium text-luxury-cream">
                      {currentProduct.stock} units
                    </span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between p-4 bg-[#141414] border border-luxury-gold/10 rounded-lg">
                    <span className="text-lg font-semibold text-luxury-gold">
                      Category:
                    </span>
                    <span className="text-lg font-medium text-luxury-cream capitalize">
                      {currentProduct.category}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between p-4 bg-[#141414] border border-luxury-gold/10 rounded-lg">
                    <span className="text-lg font-semibold text-luxury-gold">
                      Quantity:
                    </span>
                    <span className="text-lg font-medium text-luxury-cream">
                      {currentProduct.Quantity}
                    </span>
                  </div>

                  {/* Homepage Control Fields */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentProduct.isFeatured && (
                      <span className="px-3 py-1 text-sm font-bold bg-luxury-gold text-luxury-ink rounded-full">
                        ⭐ Featured Product
                      </span>
                    )}
                    {currentProduct.isNewArrival && (
                      <span className="px-3 py-1 text-sm border border-luxury-gold text-luxury-gold rounded-full">
                        🆕 New Arrival
                      </span>
                    )}
                    {currentProduct.isOnSale && (
                      <span className="px-3 py-1 text-sm bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 rounded-full">
                        🏷️ On Sale
                      </span>
                    )}
                  </div>

                  {/* Discount Price Display */}
                  {currentProduct.isOnSale && currentProduct.discountPrice && (
                    <div className="flex items-center justify-between p-4 bg-[#141414] border border-luxury-gold/10 rounded-lg">
                      <span className="text-lg font-semibold text-luxury-gold">
                        Original Price:
                      </span>
                      <span className="text-lg text-luxury-cream/40 line-through">
                        Rs. {currentProduct.price}
                      </span>
                    </div>
                  )}

                  {currentProduct.isOnSale && currentProduct.discountPrice && (
                    <div className="flex items-center justify-between p-4 bg-[#141414] border border-luxury-gold/10 rounded-lg">
                      <span className="text-lg font-semibold text-luxury-gold">
                        Sale Price:
                      </span>
                      <span className="text-2xl font-bold text-luxury-gold">
                        Rs. {currentProduct.discountPrice}
                      </span>
                    </div>
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/ProductDetailPage.tsx
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Actions Bar */}
            <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-900">
              <button
                onClick={handleAddToCart}
                disabled={currentProduct.stock <= 0 || isAdding}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 border font-medium text-xs tracking-widest uppercase transition-all duration-300 ${
                  currentProduct.stock <= 0
                    ? "bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 cursor-not-allowed"
                    : "bg-black dark:bg-white text-white dark:text-black border-transparent hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-lg hover:shadow-xl"
                }`}
              >
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>Purchase Impression</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-center text-neutral-400 dark:text-neutral-500">
                <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900">
                  <Truck size={16} className="text-blue-500" />
                  <span>Premium Courier</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900">
                  <RefreshCw size={16} className="text-amber-500" />
                  <span>14-day Exchanges</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
