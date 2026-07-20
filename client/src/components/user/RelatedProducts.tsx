import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchRelatedProducts } from "../../redux/thunks/ProductThunk";
import type { RootState, AppDispatch } from "../../redux/store";
import ProductCard from "./ProductCard";
import { ProductsGridSkeleton } from "../ui/ProductCardSkeleton";

interface RelatedProductsProps {
  productId: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { relatedProducts, relatedProductsLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchRelatedProducts(productId));
  }, [dispatch, productId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  // No empty-state message — the section simply doesn't render.
  if (!relatedProductsLoading && relatedProducts.length === 0) {
    return null;
  }

  const productsToShow = relatedProducts.slice(0, 6);

  return (
    <div className="mt-8 rounded-3xl p-8 border border-luxury-gold/10 bg-luxury-card backdrop-blur-md">
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.2em] text-luxury-gold font-bold uppercase">
          Curated For You
        </span>
        <h2 className="font-logo text-3xl font-light tracking-wide text-luxury-cream mt-1">
          You May Also Like
        </h2>
      </div>

      {relatedProductsLoading ? (
        <ProductsGridSkeleton count={4} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RelatedProducts;
