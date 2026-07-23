import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ArrowRightLeft,
  Star,
  Minus,
  Plus,
  ShieldCheck,
  Lock,
  RotateCcw,
  Truck,
  Headset,
  Share2,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSingleProductQuery, useProductBySlugQuery } from "../../queries/productQueries";
const ProductGallery = lazy(() =>
  import("../../components/user/ProductGallery")
);
const ProductReviews = lazy(() => import("../../components/user/ProductReviews"));
const RelatedProducts = lazy(() => import("../../components/user/RelatedProducts"));
const RecentlyViewed = lazy(() => import("../../components/user/RecentlyViewed"));
import ProductSEO from "../../seo/ProductSEO";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useWishlist } from "../../hooks/useWishlist";
import { useCompare } from "../../hooks/useCompare";
import { useCart } from "../../hooks/useCart";
import { MAX_COMPARE_ITEMS } from "../../queries/compareQueries";
import { addRecentlyViewed } from "../../utils/recentlyViewed";
import type { ProductVariant } from "../../redux/types/productTypes";
import { useInView } from "react-intersection-observer";
import RelatedProductsSkeleton from "../../components/skeletons/RelatedProductsSkeleton";
import ReviewSkeleton from "../../components/skeletons/ReviewSkeleton";
import RecentlyViewedSkeleton from "../../components/skeletons/RecentlyViewedSkeleton";
import GallerySkeleton from "../../components/skeletons/GallerySkeleton";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Authentic" },
  { icon: Lock, label: "Secure Checkout" },
  { icon: RotateCcw, label: "7-Day Easy Returns" },
  { icon: Truck, label: "Nationwide Delivery" },
  { icon: Headset, label: "Dedicated Support" },
];

const ProductDetailPage = () => {
  // Support both /product/:slug (SEO-friendly) and legacy /product-detail/:productId
  const { productId, slug: slugParam } = useParams<{ productId?: string; slug?: string }>();

  // Determine if the param is a numeric ID or a slug string
  const paramValue = slugParam || productId;
  const isNumericId = paramValue ? /^\d+$/.test(paramValue) : false;
  const parsedId = isNumericId ? parseInt(paramValue!) : undefined;
  const slugValue = !isNumericId ? paramValue : undefined;

  // Use the appropriate query based on param type
  const { data: productById, isLoading: loadingById, error: errorById } = useSingleProductQuery(parsedId);
  const { data: productBySlug, isLoading: loadingBySlug, error: errorBySlug } = useProductBySlugQuery(slugValue);

  // Merge results — only one query will be enabled at a time
  const currentProduct = productById || productBySlug;
  const loading = (isNumericId ? loadingById : loadingBySlug);
  const error = isNumericId ? errorById : errorBySlug;
  const { isFavorite, toggleWishlist, loadingId: wishlistLoadingId } = useWishlist();
  const { isComparing, toggleCompare, loadingId: compareLoadingId, isFull: isCompareFull } = useCompare();
  const { addToCart, isAdding } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement | null>(null);

  const hasVariants = !!currentProduct?.ProductVariants && currentProduct.ProductVariants.length > 0;

  const {
    ref: reviewsRef,
    inView: reviewsInView,
  } = useInView({
    triggerOnce: true,
    rootMargin: "300px",
  });

  const {
    ref: relatedRef,
    inView: relatedInView,
    ref: inRecentRef,
  } = useInView({
    triggerOnce: true,
    rootMargin: "300px",
  });
  useEffect(() => {
    if (currentProduct?.ProductVariants && currentProduct.ProductVariants.length > 0) {
      setSelectedVariant(currentProduct.ProductVariants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
  }, [currentProduct?.id, currentProduct?.ProductVariants]);

  useEffect(() => {
    if (!currentProduct) return;
    addRecentlyViewed({
      id: currentProduct.id,
      title: currentProduct.title,
      productImage: currentProduct.productImage,
      price: currentProduct.price,
      discountPrice: currentProduct.discountPrice,
      isOnSale: currentProduct.isOnSale,
      slug: currentProduct.slug,
    });
  }, [currentProduct]);

  useEffect(() => {
    const node = buyBoxRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [currentProduct?.id]);

  const images = useMemo(() => {
    if (!currentProduct) return [];
    if (currentProduct.ProductImages && currentProduct.ProductImages.length > 0) {
      return [...currentProduct.ProductImages]
        .sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0) || a.sortOrder - b.sortOrder)
        .map((img) => ({ id: img.id, url: img.imageUrl }));
    }
    return [{ id: "main", url: currentProduct.productImage }];
  }, [currentProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-luxury-cream/70">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-red-400">{error.message}</div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-luxury-cream/70">Product not found</div>
      </div>
    );
  }

  const effectivePrice = selectedVariant
    ? selectedVariant.price
    : currentProduct.isOnSale && currentProduct.discountPrice
      ? currentProduct.discountPrice
      : currentProduct.price;

  const originalPrice =
    !selectedVariant && currentProduct.isOnSale && currentProduct.discountPrice
      ? currentProduct.price
      : null;

  const discountPercent = originalPrice
    ? Math.round((1 - effectivePrice / originalPrice) * 100)
    : null;

  const effectiveStock = selectedVariant ? selectedVariant.stock : currentProduct.stock;
  const isOutOfStock = currentProduct.status !== "available" || effectiveStock <= 0;
  const isLowStock = !isOutOfStock && effectiveStock <= 5;

  const isWishlisted = isFavorite(currentProduct.id);
  const isWishlistBusy = wishlistLoadingId === currentProduct.id;
  const isCompared = isComparing(currentProduct.id);
  const isCompareBusy = compareLoadingId === currentProduct.id;
  const compareDisabled = isCompareBusy || (isCompareFull && !isCompared);

  const hasNotes =
    (currentProduct.topNotes?.length || 0) > 0 ||
    (currentProduct.heartNotes?.length || 0) > 0 ||
    (currentProduct.baseNotes?.length || 0) > 0;

  const handleAddToCart = async () => {
    try {
      await addToCart(currentProduct.id, quantity);
      toast.success(`${currentProduct.title} added to cart`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to cart");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: currentProduct.title, url });
      } catch {
        // user cancelled the native share sheet — no action needed
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Product link copied to clipboard");
  };

  const scrollToReviews = () => {
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pb-24 bg-luxury-ink">
      <ProductSEO product={currentProduct} />

      <div className="max-w-6xl pt-24 mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          className="mt-2 mb-6"
          items={[
            { label: "Home", path: "/" },
            { label: "Collection", path: "/all" },
            { label: currentProduct.category, path: `/${currentProduct.category}` },
            { label: currentProduct.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Suspense fallback={<GallerySkeleton />}>
              <ProductGallery
                images={images}
                title={currentProduct.title}
              />
            </Suspense>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-luxury-gold/70 mb-2">
                {currentProduct.brand && <span>{currentProduct.brand}</span>}
                {currentProduct.brand && <span className="text-luxury-cream/20">&bull;</span>}
                <span>{currentProduct.gender || currentProduct.category}</span>
              </div>
              <h1 className="font-logo text-3xl md:text-4xl font-light text-luxury-cream tracking-wide">
                {currentProduct.title}
              </h1>

              {typeof currentProduct.averageRating === "number" && currentProduct.reviewCount ? (
                <button
                  onClick={scrollToReviews}
                  className="flex items-center gap-2 mt-3 group"
                >
                  <div className="flex text-luxury-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.round(currentProduct.averageRating || 0) ? "currentColor" : "none"}
                        className={i < Math.round(currentProduct.averageRating || 0) ? "" : "text-luxury-cream/20"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-luxury-cream/60 group-hover:text-luxury-gold transition-colors duration-300">
                    {currentProduct.averageRating.toFixed(1)} &middot; {currentProduct.reviewCount} review
                    {currentProduct.reviewCount !== 1 ? "s" : ""}
                  </span>
                </button>
              ) : null}
            </div>

            {/* Badges */}
            {(currentProduct.isFeatured || currentProduct.isNewArrival || currentProduct.isOnSale) && (
              <div className="flex flex-wrap gap-2">
                {currentProduct.isFeatured && (
                  <span className="px-3 py-1 text-[11px] font-bold bg-luxury-gold text-luxury-ink rounded-full uppercase tracking-wide">
                    Featured
                  </span>
                )}
                {currentProduct.isNewArrival && (
                  <span className="px-3 py-1 text-[11px] border border-luxury-gold text-luxury-gold rounded-full uppercase tracking-wide">
                    New Arrival
                  </span>
                )}
                {currentProduct.isOnSale && (
                  <span className="px-3 py-1 text-[11px] bg-red-500/10 text-red-400 border border-red-500/30 rounded-full uppercase tracking-wide">
                    On Sale
                  </span>
                )}
              </div>
            )}

            <div
              className="text-sm text-luxury-cream/60 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_strong]:font-semibold [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_blockquote]:border-l-2 [&_blockquote]:border-luxury-gold [&_blockquote]:pl-3 [&_blockquote]:italic"
              dangerouslySetInnerHTML={{ __html: currentProduct.description || "" }}
            />

            {/* Price */}
            <div ref={buyBoxRef} className="space-y-5 p-5 rounded-2xl border border-luxury-gold/10 bg-luxury-card">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-luxury-gold">Rs. {effectivePrice.toLocaleString()}</span>
                {originalPrice && (
                  <span className="text-base text-luxury-cream/40 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                )}
                {discountPercent ? (
                  <span className="text-xs font-semibold text-emerald-400">Save {discountPercent}%</span>
                ) : null}
              </div>

              {/* Stock */}
              <div className="text-xs uppercase tracking-wider font-medium">
                {isOutOfStock ? (
                  <span className="text-red-400">Currently Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-amber-400">Only {effectiveStock} left &mdash; order soon</span>
                ) : (
                  <span className="text-emerald-400">In Stock</span>
                )}
              </div>

              {/* Variant / size selector */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-luxury-cream/50 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {hasVariants
                    ? currentProduct.ProductVariants!.map((variant) => {
                      const active = selectedVariant?.id === variant.id;
                      const disabled = variant.stock <= 0;
                      return (
                        <button
                          key={variant.id ?? variant.size}
                          onClick={() => !disabled && setSelectedVariant(variant)}
                          disabled={disabled}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${active
                            ? "border-luxury-gold bg-luxury-gold/10 text-luxury-gold"
                            : "border-luxury-gold/20 text-luxury-cream/70 hover:border-luxury-gold/50"
                            }`}
                        >
                          {variant.size}
                        </button>
                      );
                    })
                    : (
                      <span className="px-4 py-2 rounded-xl border border-luxury-gold bg-luxury-gold/10 text-luxury-gold text-sm font-medium">
                        {currentProduct.Quantity}
                      </span>
                    )}
                </div>
              </div>

              {/* Quantity stepper */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-luxury-cream/50 mb-2">Quantity</p>
                <div className="inline-flex items-center border border-luxury-gold/20 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-3 text-luxury-cream hover:text-luxury-gold hover:bg-luxury-gold/10 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-luxury-cream">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
                    disabled={isOutOfStock || quantity >= effectiveStock}
                    aria-label="Increase quantity"
                    className="p-3 text-luxury-cream hover:text-luxury-gold hover:bg-luxury-gold/10 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-stretch gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  className="flex-1 flex items-center justify-center gap-2 bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink py-3 rounded-xl font-semibold text-sm tracking-wide uppercase transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag size={15} />
                      <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => !isWishlistBusy && toggleWishlist(currentProduct.id)}
                  disabled={isWishlistBusy}
                  title="Add to Wishlist"
                  className={`flex items-center justify-center w-12 rounded-xl border transition-colors duration-300 disabled:cursor-wait ${isWishlisted
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-luxury-gold/30 text-luxury-cream hover:border-luxury-gold hover:bg-luxury-gold/10 hover:text-luxury-gold"
                    }`}
                >
                  {isWishlistBusy ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                  )}
                </button>

                <button
                  onClick={() => !compareDisabled && toggleCompare(currentProduct.id)}
                  disabled={compareDisabled}
                  title={isCompareFull && !isCompared ? `You can only compare up to ${MAX_COMPARE_ITEMS} products` : "Compare Product"}
                  className={`flex items-center justify-center w-12 rounded-xl border transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${isCompared
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-luxury-gold/30 text-luxury-cream hover:border-luxury-gold hover:bg-luxury-gold/10 hover:text-luxury-gold"
                    }`}
                >
                  {isCompareBusy ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRightLeft size={18} />
                  )}
                </button>

                <button
                  onClick={handleShare}
                  title="Share this product"
                  className="flex items-center justify-center w-12 rounded-xl border border-luxury-gold/30 text-luxury-cream hover:border-luxury-gold hover:bg-luxury-gold/10 hover:text-luxury-gold transition-colors duration-300"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TRUST_BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 p-3 rounded-xl border border-luxury-gold/10 bg-luxury-card"
                  >
                    <Icon size={16} className="text-luxury-gold shrink-0" strokeWidth={1.5} />
                    <span className="text-[11px] text-luxury-cream/70 leading-tight">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Fragrance Notes */}
        {hasNotes && (
          <div className="mt-12 rounded-3xl p-8 border border-luxury-gold/10 bg-luxury-card">
            <h2 className="font-logo text-2xl font-light text-luxury-cream tracking-wide mb-6">Fragrance Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Top Notes", notes: currentProduct.topNotes },
                { label: "Middle Notes", notes: currentProduct.heartNotes },
                { label: "Base Notes", notes: currentProduct.baseNotes },
              ].map(
                (tier) =>
                  tier.notes &&
                  tier.notes.length > 0 && (
                    <div key={tier.label} className="text-center">
                      <p className="text-[11px] uppercase tracking-widest text-luxury-gold mb-3">{tier.label}</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {tier.notes.map((note) => (
                          <span
                            key={note}
                            className="px-3 py-1 text-xs rounded-full border border-luxury-gold/20 text-luxury-cream/70"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        {/* Specifications */}
        <div className="mt-8 rounded-3xl p-8 border border-luxury-gold/10 bg-luxury-card">
          <h2 className="font-logo text-2xl font-light text-luxury-cream tracking-wide mb-6">Specifications</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {[
              ["Brand", currentProduct.brand],
              ["Category", currentProduct.category],
              ["Gender", currentProduct.gender],
              ["Size", selectedVariant?.size || currentProduct.Quantity],
              ["SKU", selectedVariant?.sku],
              ["Availability", currentProduct.status === "available" ? "In Stock" : "Unavailable"],
            ]
              .filter(([, value]) => !!value)
              .map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-luxury-gold/10 pb-2">
                  <dt className="text-luxury-cream/50">{label}</dt>
                  <dd className="text-luxury-cream font-medium">{value}</dd>
                </div>
              ))}
          </dl>
        </div>

        <div ref={reviewsRef}>
          <Suspense fallback={<ReviewSkeleton />}>
            {reviewsInView && (
              <ProductReviews productId={currentProduct.id} />
            )}
          </Suspense>
        </div>

        <div ref={relatedRef}>
          <Suspense fallback={<RelatedProductsSkeleton />}>
            {relatedInView && (
              <RelatedProducts productId={currentProduct.id} />
            )}
          </Suspense>
        </div>

        <div ref={inRecentRef} className="mt-16">
          <Suspense fallback={<RecentlyViewedSkeleton />}>
            {relatedInView && (
              <RecentlyViewed excludeId={currentProduct.id} />
            )}
          </Suspense>
        </div>
      </div>

      {/* Sticky purchase bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-luxury-gold/15 bg-luxury-ink/95 backdrop-blur-md"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <img
                src={currentProduct.productImage}
                alt={currentProduct.title}
                className="w-11 h-11 rounded-lg object-cover border border-luxury-gold/10 hidden sm:block"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-luxury-cream truncate">{currentProduct.title}</p>
                <p className="text-xs font-semibold text-luxury-gold">Rs. {effectivePrice.toLocaleString()}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="px-5 py-2.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink text-xs font-semibold uppercase tracking-wide transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
