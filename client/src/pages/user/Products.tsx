


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/thunks/ProductThunk";
import type { RootState, AppDispatch } from "../../redux/store";
import { useParams, Link } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  const filteredProducts =
    category && category !== "all"
      ? products.filter(
          (p: any) => p.category.toLowerCase() === category.toLowerCase()
        )
      : products;

  return (
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
        )}
      </div>
    </div>
  );
};

export default Products;
