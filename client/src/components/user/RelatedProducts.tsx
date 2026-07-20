import { motion } from "framer-motion";
import { useRelatedProductsQuery } from "../../queries/productQueries";
import ProductCard from "./ProductCard";
import { ProductsGridSkeleton } from "../ui/ProductCardSkeleton";

interface RelatedProductsProps {
  productId: number;
}

const getGridColsClass = (count: number) => {
  if (count <= 1) return "grid-cols-1 max-w-xs mx-auto";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto";
  if (count === 3) return "grid-cols-1 sm:grid-cols-3";
  if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  if (count === 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
};

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
  const { data: relatedProducts = [], isLoading } = useRelatedProductsQuery(productId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  if (!isLoading && relatedProducts.length === 0) return null;

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

      {isLoading ? (
        <ProductsGridSkeleton count={4} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid gap-6 ${getGridColsClass(productsToShow.length)}`}
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
