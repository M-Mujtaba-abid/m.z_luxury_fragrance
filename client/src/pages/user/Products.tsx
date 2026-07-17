<<<<<<< HEAD:client/src/user_side/pages/Products.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductsByCategoryQuery } from "../../queries/productQueries";
import ProductCard from "../component/ProductCard";
import { ProductsGridSkeleton } from "../../components/ui/ProductCardSkeleton";
import QuickViewModal from "../component/QuickViewModal";
import SEO from "../../components/ui/SEO";
=======



import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/thunks/ProductThunk";
import type { RootState, AppDispatch } from "../../redux/store";
import { useParams, Link } from "react-router-dom";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/Products.tsx

const Products = () => {
  const { category } = useParams<{ category: string }>();
  const { data: filteredProducts = [], isLoading, error } = useProductsByCategoryQuery(category);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
<<<<<<< HEAD:client/src/user_side/pages/Products.tsx
    <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-950 py-12">
      <SEO title={category ? `${category} Collection` : "All Fragrances"} />
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        
        
        {/* Category Header */}
        <div className="pt-16 mb-10">
          <span className="text-[10px] tracking-[0.3em] text-neutral-400 dark:text-neutral-500 font-bold uppercase">
            Luxury Blends
          </span>
          <h1 className="text-4xl font-light text-neutral-900 dark:text-white tracking-wide capitalize mt-2">
            {category ? `${category} Collection` : "All Products"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-center">
            Failed to retrieve products. Please refresh and try again.
          </div>
        )}

        {/* Product Grid / Skeleton */}
        {isLoading ? (
          <ProductsGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            No products found in the {category} collection.
          </div>
=======
    <div className="min-h-screen  bg-luxury-ink py-8">
      <div className="max-w-7xl  p-4 sm:p-6 lg:p-8 mx-auto">
        <h1 className="font-logo text-3xl pt-[35px] font-bold text-luxury-cream mb-6">
          {category && category !== "all" ? `${category} Products` : "All Products"}
        </h1>

        {loading && <p className="text-luxury-cream/60">Loading...</p>}
        {error && (
          <div className="mb-4 p-4 bg-red-950/40 border border-red-900/50 text-red-300 rounded">
            {error}
          </div>
        )}

        {/* ✅ Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product: any) => (
            <Link
              key={product.id}
              to={`/web/product-detail/${product.id}`}
              className="group"
            >
              <div
                className="bg-luxury-ink border border-luxury-gold/10
                rounded-lg shadow cursor-pointer
                hover:shadow-lg hover:border-luxury-gold/30 transition duration-300 flex flex-col"
              >
                {/* 🔥 Image Full Card Top */}
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={product.productImage}
                    alt={product.title}
                    className="w-full h-72 sm:h-80 md:h-90 object-cover
                    transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* 🔥 Only Title + Price */}
                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-bold text-luxury-cream mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                    {product.title.slice(0,20)}...
                  </h2>

                  <p className="font-semibold text-luxury-gold">
                    Rs. {product.price}
                  </p>
                </div>

                {/* ❌ Description */}
                {/* <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {product.description}
                </p> */}

                {/* ❌ Category */}
                {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {product.category}
                </p> */}

                {/* ❌ Tags */}
                {/* <div className="flex flex-wrap gap-2 mt-2">
                  {product.isFeatured && <span>⭐ Featured</span>}
                  {product.isNewArrival && <span>🆕 New</span>}
                  {product.isOnSale && <span>🏷️ Sale</span>}
                </div> */}

                {/* ❌ Discount */}
                {/* {product.isOnSale && product.discountPrice && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500 line-through">
                      Rs. {product.price}
                    </span>
                    <span className="text-sm font-bold text-red-600 ml-2">
                      Rs. {product.discountPrice}
                    </span>
                  </div>
                )} */}
              </div>
            </Link>
          ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p className="text-center text-luxury-cream/50 mt-6">
            {category && category !== "all"
              ? `No products found for ${category}.`
              : "No products found."}
          </p>
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/pages/user/Products.tsx
        )}
      </div>

      {/* Quick View Drawer */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Products;
