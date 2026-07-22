
import { useState } from "react";
import { useProductsQuery } from "../../queries/productQueries";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/ui/Breadcrumb";
import ProductCard from "../../components/user/ProductCard";
import QuickViewModal from "../../components/user/QuickViewModal";
import type { Product } from "../../redux/types/productTypes";

const Products = () => {
  const { category } = useParams<{ category: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading: loading, error } = useProductsQuery();

  const filteredProducts =
    category && category !== "all"
      ? products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      : products;

  return (
    <div className="min-h-screen  bg-luxury-ink py-8">
      <div className="max-w-7xl  p-4 sm:p-6 lg:p-8 mx-auto">
        {category && category !== "all" && (
          <Breadcrumb
            className="pt-[35px]"
            items={[
              { label: "Home", path: "/" },
              { label: "Collection", path: "/all" },
              { label: category },
            ]}
          />
        )}
        <h1 className={`font-logo text-3xl font-bold text-luxury-cream mb-6 ${category && category !== "all" ? "" : "pt-[35px]"}`}>
          {category && category !== "all" ? `${category} Products` : "All Products"}
        </h1>

        {loading && <p className="text-luxury-cream/60">Loading...</p>}
        {error && (
          <div className="mb-4 p-4 bg-red-950/40 border border-red-900/50 text-red-300 rounded">
            {error.message}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p className="text-center text-luxury-cream/50 mt-6">
            {category && category !== "all"
              ? `No products found for ${category}.`
              : "No products found."}
          </p>
        )}
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Products;
