
import { useState } from "react";
import { useProductsQuery } from "../../queries/productQueries";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/ui/Breadcrumb";
import ProductCard from "../../components/user/ProductCard";
import QuickViewModal from "../../components/user/QuickViewModal";
import type { Product } from "../../redux/types/productTypes";
import SEO from "../../seo/SEO";

const Products = () => {
  const { category } = useParams<{ category: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading: loading, error } = useProductsQuery();

  const filteredProducts =
    category && category !== "all"
      ? products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      : products;

  // Dynamic Category SEO Meta Titles & Descriptions
  const normalizedCategory = category ? category.trim() : "";
  const isMenCategory = normalizedCategory.toLowerCase() === "men";
  const isWomenCategory = normalizedCategory.toLowerCase() === "women";

  const categoryTitle = isMenCategory
    ? "Men Perfume Impressions"
    : isWomenCategory
    ? "Women Perfume Impressions"
    : category && category !== "all"
    ? `${category} Fragrances`
    : "All Luxury Perfumes & Fragrances";

  const categoryDescription = isMenCategory
    ? "Explore our signature collection of long-lasting Men perfume impressions formulated with rich oud, rare woods, and organic Grasse oils."
    : isWomenCategory
    ? "Discover delicate floral, Madagascar vanilla, and warm amber perfume impressions crafted for Women."
    : "Browse our complete catalog of luxury perfume impressions formulated with organic oils and fine accords.";

  const categoryCanonical = category && category !== "all" ? `/${category}` : "/all-products";

  return (
    <div className="min-h-screen  bg-luxury-ink py-8">
      <SEO
        title={categoryTitle}
        description={categoryDescription}
        canonicalUrl={categoryCanonical}
      />
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
