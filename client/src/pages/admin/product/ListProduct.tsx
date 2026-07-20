import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminProductsQuery } from "../../../queries/productQueries";

const ListProduct = () => {
  const navigate = useNavigate();
  const { data: products = [], isLoading: loading, error } = useAdminProductsQuery();

  const handleDetailView = (productId: number) => {
    navigate(`/admin/product-detail/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-ink flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-ink">
      <div className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md p-6">
        <h1 className="font-logo text-2xl sm:text-3xl font-bold text-luxury-cream mb-5 pl-14 md:pl-0">
          Product List <span className="text-luxury-cream/50 font-sans text-base sm:text-xl">({products.length})</span>
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-950/40 border border-red-900/50 text-red-300 rounded-lg">
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
              className="relative bg-luxury-ink border border-luxury-gold/10 rounded-lg overflow-hidden hover:border-luxury-gold/30 transition-colors duration-300"
            >
              {/* Draft/Published status badge */}
              <span
                className={`absolute top-3 left-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  product.publishStatus === "published"
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30"
                }`}
              >
                {product.publishStatus === "published" ? "Published" : "Draft"}
              </span>

              <div className="w-full h-48 overflow-hidden">
                <img src={product.productImage} alt={product.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-luxury-cream mb-1 truncate">{product.title}</h3>
                <p className="text-luxury-cream/60 text-sm mb-2 line-clamp-2">
                  {product.description?.replace(/<[^>]*>/g, "").slice(0, 60)}...
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-luxury-gold">Rs. {product.price}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.status === "available"
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}>
                    {product.status}
                  </span>
                </div>

                <div className="flex flex-wrap justify-between gap-2 mb-3 text-xs">
                  <span className="text-luxury-cream/70">Stock: <span className="text-luxury-cream/50">{product.stock}</span></span>
                  <span className="text-luxury-cream/70 capitalize">Category: <span className="text-luxury-cream/50">{product.category}</span></span>
                  <span className="text-luxury-cream/70 capitalize">Size: <span className="text-luxury-cream/50">{product.Quantity}</span></span>
                </div>

                {product.ProductVariants?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.ProductVariants.map((variant: any) => (
                      <span key={variant.id ?? variant.size} className="px-2 py-1 text-xs rounded-full bg-luxury-elevated text-luxury-cream/70 border border-luxury-gold/10">
                        {variant.size}: Rs. {variant.price} ({variant.stock} in stock)
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  {product.isFeatured && <span className="px-2 py-1 text-xs rounded-full bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30">Featured</span>}
                  {product.isNewArrival && <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">New</span>}
                  {product.isOnSale && <span className="px-2 py-1 text-xs rounded-full bg-red-500/15 text-red-300 border border-red-500/30">Sale</span>}
                </div>

                {product.isOnSale && product.discountPrice && (
                  <div className="mb-3 text-sm">
                    <span className="text-luxury-cream/40 line-through">Rs. {product.price}</span>
                    <span className="font-bold text-luxury-gold ml-2">Rs. {product.discountPrice}</span>
                  </div>
                )}

                <button
                  onClick={() => handleDetailView(product.id)}
                  className="w-full px-3 py-2 bg-luxury-gold text-luxury-ink text-sm font-medium rounded-md hover:bg-luxury-gold-bright transition-colors duration-300"
                >
                  Detail View
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-luxury-cream/50 text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProduct;
