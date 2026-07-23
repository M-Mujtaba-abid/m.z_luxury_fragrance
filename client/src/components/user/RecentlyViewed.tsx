import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecentlyViewed, type RecentlyViewedProduct } from "../../utils/recentlyViewed";

interface RecentlyViewedProps {
  excludeId: number;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ excludeId }) => {
  const [items, setItems] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed(excludeId));
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <div className="mt-8 rounded-3xl p-8 border border-luxury-gold/10 bg-luxury-card">
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.2em] text-luxury-gold font-bold uppercase">
          Your History
        </span>
        <h2 className="font-logo text-2xl font-light tracking-wide text-luxury-cream mt-1">
          Recently Viewed
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        {items.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="shrink-0 w-36"
          >
            <Link
              to={product.slug ? `/product/${product.slug}` : `/product-detail/${product.id}`}
              className="block group"
            >
              <div className="w-36 h-36 rounded-xl overflow-hidden border border-luxury-gold/10 bg-luxury-ink">
                <img
                  src={product.productImage}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="mt-2 text-xs text-luxury-cream/80 truncate group-hover:text-luxury-gold-bright transition-colors duration-300">
                {product.title}
              </p>
              <p className="text-xs font-semibold text-luxury-gold">
                Rs. {product.isOnSale && product.discountPrice ? product.discountPrice : product.price}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
