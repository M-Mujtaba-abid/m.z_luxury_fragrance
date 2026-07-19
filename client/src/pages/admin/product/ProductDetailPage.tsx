import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProductById, deleteProduct } from "../../../redux/thunks/ProductThunk";
import { clearError, clearCurrentProduct } from "../../../redux/slices/ProductSlice";
import type { RootState, AppDispatch } from "../../../redux/store";
import Breadcrumb from "../../../components/ui/Breadcrumb";

const infoRowClass =
  "flex items-center justify-between p-4 bg-luxury-ink border border-luxury-gold/10 rounded-lg";
const labelClass = "text-sm font-semibold text-luxury-cream/70";

const ProductDetailPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { loading, error, currentProduct } = useSelector(
    (state: RootState) => state.products
  ) as any;

  useEffect(() => {
    if (productId) {
      dispatch(getProductById({ id: parseInt(productId), includeAll: true }));
    }

    return () => {
      dispatch(clearError());
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

  const handleDelete = async () => {
    if (!currentProduct) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(currentProduct.id)).unwrap();
        navigate("/admin/products");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleEdit = () => {
    if (!currentProduct) return;
    navigate(`/admin/product/${currentProduct.id}`);
  };

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
        <div className="text-xl font-semibold text-red-400">{error}</div>
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

  return (
    <div className="min-h-screen py-8 bg-luxury-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Dashboard", path: "/admin" },
            { label: "Products", path: "/admin/products" },
            { label: currentProduct.title },
          ]}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-luxury-gold/10 bg-luxury-elevated">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <h1 className="font-logo text-3xl font-bold text-luxury-cream">Product Details</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentProduct.publishStatus === "published"
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30"
                  }`}
                >
                  {currentProduct.publishStatus === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <button
                onClick={() => navigate("/admin/products")}
                className="px-4 py-2 border border-luxury-gold text-luxury-gold rounded-md hover:bg-luxury-gold/10 transition-colors duration-300"
              >
                Back to Products
              </button>
            </div>
          </div>

          {/* Product Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg border border-luxury-gold/10">
                  <img
                    src={currentProduct.productImage}
                    alt={currentProduct.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
                {currentProduct.ProductImages?.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {currentProduct.ProductImages.map((img: any) => (
                      <div
                        key={img.id}
                        className={`aspect-square rounded-md overflow-hidden border ${
                          img.isCover ? "border-luxury-gold" : "border-luxury-gold/10"
                        }`}
                      >
                        <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-logo text-2xl font-bold text-luxury-cream mb-1">
                    {currentProduct.title}
                  </h2>
                  {currentProduct.brand && (
                    <p className="text-sm text-luxury-gold mb-2">{currentProduct.brand}</p>
                  )}
                  <div
                    className="text-luxury-cream/70 leading-relaxed [&_p]:mb-2"
                    dangerouslySetInnerHTML={{ __html: currentProduct.description }}
                  />
                </div>

                <div className="space-y-3">
                  {/* Price */}
                  <div className="flex items-center justify-between p-4 bg-luxury-gold/10 border border-luxury-gold/20 rounded-lg">
                    <span className={labelClass}>Price:</span>
                    <span className="text-2xl font-bold text-luxury-gold">
                      Rs. {currentProduct.price}
                    </span>
                  </div>

                  {/* Status */}
                  <div className={infoRowClass}>
                    <span className={labelClass}>Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentProduct.status === "available"
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : "bg-red-500/15 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {currentProduct.status}
                    </span>
                  </div>

                  {/* Stock */}
                  <div className={infoRowClass}>
                    <span className={labelClass}>Stock:</span>
                    <span className="text-luxury-cream">{currentProduct.stock} units</span>
                  </div>

                  {/* Category */}
                  <div className={infoRowClass}>
                    <span className={labelClass}>Category:</span>
                    <span className="text-luxury-cream capitalize">{currentProduct.category}</span>
                  </div>

                  {/* Gender */}
                  {currentProduct.gender && (
                    <div className={infoRowClass}>
                      <span className={labelClass}>Gender:</span>
                      <span className="text-luxury-cream">{currentProduct.gender}</span>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className={infoRowClass}>
                    <span className={labelClass}>Default Size:</span>
                    <span className="text-luxury-cream">{currentProduct.Quantity}</span>
                  </div>

                  {/* Variants */}
                  {currentProduct.ProductVariants?.length > 0 && (
                    <div className={infoRowClass}>
                      <span className={labelClass}>Variants:</span>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {currentProduct.ProductVariants.map((v: any) => (
                          <span
                            key={v.id}
                            className="text-xs px-2 py-1 rounded-full bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20"
                          >
                            {v.size} — Rs. {v.price}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {(currentProduct.topNotes?.length ||
                    currentProduct.heartNotes?.length ||
                    currentProduct.baseNotes?.length) && (
                    <div className="p-4 bg-luxury-ink border border-luxury-gold/10 rounded-lg space-y-2">
                      {currentProduct.topNotes?.length > 0 && (
                        <p className="text-sm">
                          <span className={labelClass}>Top: </span>
                          <span className="text-luxury-cream/80">{currentProduct.topNotes.join(", ")}</span>
                        </p>
                      )}
                      {currentProduct.heartNotes?.length > 0 && (
                        <p className="text-sm">
                          <span className={labelClass}>Heart: </span>
                          <span className="text-luxury-cream/80">{currentProduct.heartNotes.join(", ")}</span>
                        </p>
                      )}
                      {currentProduct.baseNotes?.length > 0 && (
                        <p className="text-sm">
                          <span className={labelClass}>Base: </span>
                          <span className="text-luxury-cream/80">{currentProduct.baseNotes.join(", ")}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Homepage Control Fields */}
                  <div className={infoRowClass}>
                    <span className={labelClass}>Featured Product:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentProduct.isFeatured
                          ? "bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30"
                          : "bg-luxury-cream/5 text-luxury-cream/50 border border-luxury-cream/10"
                      }`}
                    >
                      {currentProduct.isFeatured ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className={infoRowClass}>
                    <span className={labelClass}>New Arrival:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentProduct.isNewArrival
                          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                          : "bg-luxury-cream/5 text-luxury-cream/50 border border-luxury-cream/10"
                      }`}
                    >
                      {currentProduct.isNewArrival ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className={infoRowClass}>
                    <span className={labelClass}>On Sale:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentProduct.isOnSale
                          ? "bg-red-500/15 text-red-300 border border-red-500/30"
                          : "bg-luxury-cream/5 text-luxury-cream/50 border border-luxury-cream/10"
                      }`}
                    >
                      {currentProduct.isOnSale ? "Yes" : "No"}
                    </span>
                  </div>

                  {/* Discount Price */}
                  {currentProduct.isOnSale && currentProduct.discountPrice && (
                    <div className="flex items-center justify-between p-4 bg-red-950/30 border border-red-900/40 rounded-lg">
                      <span className={labelClass}>Discount Price:</span>
                      <span className="text-2xl font-bold text-red-400">
                        Rs. {currentProduct.discountPrice}
                      </span>
                    </div>
                  )}

                  {/* Created Date */}
                  {currentProduct.createdAt && (
                    <div className={infoRowClass}>
                      <span className={labelClass}>Created:</span>
                      <span className="text-luxury-cream">
                        {new Date(currentProduct.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEdit}
                    className="flex-1 px-6 py-3 bg-luxury-gold text-luxury-ink font-semibold rounded-lg hover:bg-luxury-gold-bright transition-colors duration-300"
                  >
                    Edit Product
                  </motion.button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 text-red-400 border border-red-400/50 font-semibold rounded-lg hover:bg-red-500/10 hover:border-red-400 transition-colors duration-300"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
