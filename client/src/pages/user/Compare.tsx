import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X, ArrowRightLeft, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useCompare } from "../../hooks/useCompare";
import { useRemoveFromCompareMutation, useClearCompareMutation, MAX_COMPARE_ITEMS } from "../../queries/compareQueries";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../redux/types/productTypes";
import { ImageLoader } from "../../components/ui/ImageLoader";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import SEO from "../../components/ui/SEO";
import Breadcrumb from "../../components/ui/Breadcrumb";

interface SpecRow {
  label: string;
  render: (product: Product) => React.ReactNode;
}

const formatNotes = (notes?: string[]) => (notes && notes.length ? notes.join(", ") : "—");

const SPEC_ROWS: SpecRow[] = [
  {
    label: "Price",
    render: (p) =>
      p.isOnSale && p.discountPrice ? (
        <span className="flex items-center gap-2">
          <span className="text-red-400 font-semibold">Rs. {p.discountPrice}</span>
          <span className="text-luxury-cream/40 line-through text-xs">Rs. {p.price}</span>
        </span>
      ) : (
        `Rs. ${p.price}`
      ),
  },
  { label: "Category", render: (p) => p.category },
  { label: "Brand", render: (p) => p.brand || "—" },
  { label: "Gender", render: (p) => p.gender || "—" },
  { label: "Size", render: (p) => p.Quantity || "—" },
  {
    label: "Stock",
    render: (p) =>
      p.stock <= 0 ? (
        <span className="text-red-400 font-bold">Sold Out</span>
      ) : p.stock <= 5 ? (
        <span className="text-amber-400">Only {p.stock} left</span>
      ) : (
        <span className="text-emerald-400">In Stock</span>
      ),
  },
  { label: "Top Notes", render: (p) => formatNotes(p.topNotes) },
  { label: "Heart Notes", render: (p) => formatNotes(p.heartNotes) },
  { label: "Base Notes", render: (p) => formatNotes(p.baseNotes) },
];

const EmptySlot = () => (
  <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 border border-dashed border-luxury-gold/20 rounded-xl sm:rounded-2xl p-4 sm:p-10 text-center h-full min-h-[160px] sm:min-h-[280px]">
    <ArrowRightLeft size={20} className="text-luxury-cream/20 sm:hidden" strokeWidth={1} />
    <ArrowRightLeft size={28} className="hidden sm:block text-luxury-cream/20" strokeWidth={1} />
    <p className="text-luxury-cream/50 text-[11px] sm:text-sm">
      Add another product to compare (up to {MAX_COMPARE_ITEMS}).
    </p>
    <Link
      to="/all-products"
      className="text-[10px] sm:text-xs uppercase tracking-widest text-luxury-gold hover:text-luxury-gold-bright transition-colors duration-300"
    >
      Browse Products
    </Link>
  </div>
);

const Compare = () => {
  const { addToCart } = useCart();
  const { compareItems, totalItems, isLoading, isError } = useCompare();
  const removeMutation = useRemoveFromCompareMutation();
  const clearMutation = useClearCompareMutation();

  const products = compareItems
    .map((item) => item.Product)
    .filter((product): product is Product => Boolean(product));

  const handleRemove = (productId: number) => {
    removeMutation.mutate(productId, {
      onSuccess: () => toast.success("Removed from Compare list"),
      onError: () => toast.error("Failed to remove item"),
    });
  };

  const handleClear = () => {
    clearMutation.mutate(undefined, {
      onSuccess: () => toast.success("Compare list cleared"),
      onError: () => toast.error("Failed to clear compare list"),
    });
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.title} added to cart`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to add to cart");
    }
  };

  const slots: (Product | null)[] = Array.from({ length: MAX_COMPARE_ITEMS }).map(
    (_, idx) => products[idx] ?? null
  );

  return (
    <div className="min-h-screen bg-luxury-ink py-6 sm:py-12">
      <SEO title="Compare Products" description="Compare fragrances side by side" />
      <div className="max-w-5xl px-2.5 sm:px-6 lg:px-8 mx-auto">
        <div className="pt-16 mb-6 sm:mb-10 flex flex-wrap items-end justify-between gap-2 sm:gap-4">
          <div>
            <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Compare" }]} />
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-luxury-gold font-bold uppercase">
              Side by side
            </span>
            <h1 className="font-logo text-2xl sm:text-4xl font-light text-luxury-cream tracking-wide mt-2">
              Compare Products
            </h1>
          </div>

          {products.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearMutation.isPending}
              className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] text-luxury-cream/60 hover:text-red-400 transition-colors duration-300 disabled:opacity-50"
            >
              {clearMutation.isPending ? "Clearing..." : "Clear Compare List"}
            </button>
          )}
        </div>

        {isError && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 text-red-300 rounded-2xl text-center">
            Failed to load your compare list. Please try again.
          </div>
        )}

        {isLoading ? (
          <ProductsGridSkeleton count={2} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-2.5 sm:gap-8"
          >
            {slots.map((product, idx) =>
              product ? (
                <div
                  key={product.id}
                  className="relative flex flex-col overflow-hidden rounded-lg sm:rounded-2xl border border-luxury-gold/10 bg-luxury-card shadow-sm"
                >
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={removeMutation.isPending}
                    className="absolute right-1.5 top-1.5 sm:right-3 sm:top-3 z-10 p-1.5 sm:p-2 rounded-full bg-luxury-elevated/80 text-luxury-cream hover:bg-red-500 hover:text-white backdrop-blur-md transition-colors duration-300 disabled:opacity-50"
                    title="Remove from Compare"
                  >
                    <X size={12} className="sm:hidden" />
                    <X size={14} className="hidden sm:block" />
                  </button>

                  <Link to={`/product-detail/${product.id}`} className="block">
                    <div className="relative overflow-hidden aspect-[4/5]">
                      <ImageLoader
                        src={product.productImage}
                        alt={product.title}
                        aspectRatio="aspect-full"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-logo text-xs sm:text-lg font-light text-luxury-cream tracking-wide px-2 sm:px-5 pt-2 sm:pt-4 truncate">
                      {product.title}
                    </h3>
                  </Link>

                  <table className="w-full text-[10px] sm:text-sm mt-1.5 sm:mt-3">
                    <tbody>
                      {SPEC_ROWS.map((row) => (
                        <tr key={row.label} className="border-t border-luxury-gold/10">
                          <td className="px-2 py-1 sm:px-5 sm:py-2.5 text-luxury-cream/50 uppercase text-[7px] sm:text-[10px] tracking-wide sm:tracking-widest align-top w-2/5 sm:w-1/3">
                            {row.label}
                          </td>
                          <td className="px-2 py-1 sm:px-5 sm:py-2.5 text-luxury-cream/90 break-words">
                            {row.render(product)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-auto p-2 sm:p-5">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`w-full py-1.5 sm:py-2.5 rounded-md sm:rounded-lg flex items-center justify-center gap-1 sm:gap-2 border font-medium text-[9px] sm:text-xs tracking-wide sm:tracking-widest uppercase transition-all duration-300 ${product.stock <= 0
                          ? "bg-luxury-ink border-luxury-gold/10 text-luxury-cream/30 cursor-not-allowed"
                          : "bg-luxury-gold border-transparent text-luxury-ink hover:bg-luxury-gold-bright shadow-md hover:shadow-lg"
                        }`}
                    >
                      <ShoppingBag size={11} className="sm:hidden" />
                      <ShoppingBag size={13} className="hidden sm:block" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ) : (
                <EmptySlot key={`empty-${idx}`} />
              )
            )}
          </motion.div>
        )}

        {!isLoading && !isError && totalItems !== products.length && (
          <p className="text-center text-luxury-cream/40 text-[10px] sm:text-xs mt-4 sm:mt-6">
            {totalItems - products.length} compared item(s) are no longer available and were hidden.
          </p>
        )}
      </div>
    </div>
  );
};

export default Compare;
