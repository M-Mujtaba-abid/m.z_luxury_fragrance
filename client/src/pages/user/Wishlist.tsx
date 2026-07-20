import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlist } from "../../hooks/useWishlist";
import { useClearWishlistMutation } from "../../queries/wishlistQueries";
import ProductCard from "../../components/user/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import SEO from "../../components/ui/SEO";
import Breadcrumb from "../../components/ui/Breadcrumb";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const Wishlist = () => {
  const { wishlistItems, totalItems, isLoading, isError } = useWishlist();
  const clearWishlistMutation = useClearWishlistMutation();

  // Products with an eager-loaded Product row - defensive filter in case a
  // wishlisted product was since deleted from the catalog.
  const products = wishlistItems
    .map((item) => item.Product)
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const handleClearWishlist = () => {
    clearWishlistMutation.mutate(undefined, {
      onSuccess: () => toast.success("Wishlist cleared"),
      onError: () => toast.error("Failed to clear wishlist"),
    });
  };

  return (
    <div className="min-h-screen bg-luxury-ink py-12">
      <SEO title="My Wishlist" description="Products you've saved for later" />
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="pt-16 mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Breadcrumb
              items={[
                { label: "Home", path: "/web" },
                { label: "My Wishlist" },
              ]}
            />
            <span className="text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase">
              Saved for later
            </span>
            <h1 className="font-logo text-4xl font-light text-luxury-cream tracking-wide mt-2">
              My Wishlist
            </h1>
          </div>

          {products.length > 0 && (
            <button
              onClick={handleClearWishlist}
              disabled={clearWishlistMutation.isPending}
              className="text-xs font-medium uppercase tracking-[0.2em] text-luxury-cream/60 hover:text-red-400 transition-colors duration-300 disabled:opacity-50"
            >
              {clearWishlistMutation.isPending ? "Clearing..." : "Clear Wishlist"}
            </button>
          )}
        </div>

        {isError && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 text-red-300 rounded-2xl text-center">
            Failed to load your wishlist. Please try again.
          </div>
        )}

        {isLoading ? (
          <ProductsGridSkeleton count={6} />
        ) : products.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart size={40} className="text-luxury-cream/20 mb-4" strokeWidth={1} />
            <p className="text-luxury-cream/50">
              Your wishlist is empty. Tap the heart on any product to save it here.
            </p>
          </div>
        )}

        {!isLoading && !isError && totalItems !== products.length && (
          <p className="text-center text-luxury-cream/40 text-xs mt-6">
            {totalItems - products.length} saved item(s) are no longer available and were hidden.
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
