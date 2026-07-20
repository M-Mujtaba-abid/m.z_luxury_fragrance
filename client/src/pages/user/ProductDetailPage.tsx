import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ArrowRightLeft } from "lucide-react";
import { getProductById } from "../../redux/thunks/ProductThunk";
import {
  clearError,
  clearCurrentProduct,
} from "../../redux/slices/ProductSlice";
import type { RootState, AppDispatch } from "../../redux/store";
import AddToCartButton from "../../components/user/AddToCartButton";
import ProductReviews from "../../components/user/ProductReviews";
import RelatedProducts from "../../components/user/RelatedProducts";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useWishlist } from "../../hooks/useWishlist";
import { useCompare } from "../../hooks/useCompare";
import { MAX_COMPARE_ITEMS } from "../../queries/compareQueries";

const ProductDetailPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { loading, error, currentProduct } = useSelector(
    (state: RootState) => state.products
  );
  const { isFavorite, toggleWishlist, loadingId: wishlistLoadingId } = useWishlist();
  const {
    isComparing,
    toggleCompare,
    loadingId: compareLoadingId,
    isFull: isCompareFull,
  } = useCompare();

  useEffect(() => {
    if (productId) {
      dispatch(getProductById({ id: parseInt(productId) }));
    }
    return () => {
      dispatch(clearError());
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-luxury-cream/70">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-red-400">{error}</div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-ink">
        <div className="text-xl font-semibold text-luxury-cream/70">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8  bg-luxury-ink">
      <div className="max-w-4xl pt-10 mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", path: "/web" },
            { label: "Collection", path: "/web/all" },
            { label: currentProduct.category, path: `/web/${currentProduct.category}` },
            { label: currentProduct.title },
          ]}
        />
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
                      }`}
                    >
                      {currentProduct.status}
                    </span>
                  </div>

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
                  )}

                  {/* Created Date */}
                  {/* {currentProduct.createdAt && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <button className="px-4 py-2 bg-blue-600 w-full text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Order now
                      </button>
                    </div>
                    )} */}
                    <div className="flex items-stretch gap-3 p-4 pt-0">
                      <div className="flex-1">
                        <AddToCartButton productId={currentProduct.id} className="!p-0" />
                      </div>

                      {(() => {
                        const isWishlisted = isFavorite(currentProduct.id);
                        const isWishlistBusy = wishlistLoadingId === currentProduct.id;
                        const isCompared = isComparing(currentProduct.id);
                        const isCompareBusy = compareLoadingId === currentProduct.id;
                        const compareDisabled = isCompareBusy || (isCompareFull && !isCompared);

                        return (
                          <>
                            <button
                              onClick={() => !isWishlistBusy && toggleWishlist(currentProduct.id)}
                              disabled={isWishlistBusy}
                              title="Add to Wishlist"
                              className={`mt-3 flex items-center justify-center w-12 rounded-md border transition-colors duration-300 disabled:cursor-wait ${
                                isWishlisted
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
                              title={
                                isCompareFull && !isCompared
                                  ? `You can only compare up to ${MAX_COMPARE_ITEMS} products`
                                  : "Compare Product"
                              }
                              className={`mt-3 flex items-center justify-center w-12 rounded-md border transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                                isCompared
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
                          </>
                        );
                      })()}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductReviews productId={currentProduct.id} />

        <RelatedProducts productId={currentProduct.id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
