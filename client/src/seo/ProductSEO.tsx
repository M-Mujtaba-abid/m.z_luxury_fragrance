// src/seo/ProductSEO.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Specific SEO component for single Product Detail pages.
// Consumes `<ProductSEO product={product} />` and automatically outputs:
//   • Dynamic page title & fallback
//   • Dynamic meta description & fallback
//   • Canonical URL (/product/:slug)
//   • OpenGraph product tags & image
//   • Schema.org Product JSON-LD
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import type { Product } from "../redux/types/productTypes";
import SEO from "./SEO";
import ProductSchema from "./ProductSchema";
import { SITE_NAME, SITE_URL } from "./constants";

interface ProductSEOProps {
  product: Product | null | undefined;
}

export const ProductSEO: React.FC<ProductSEOProps> = ({ product }) => {
  if (!product) return null;

  // 1. Dynamic Title with Fallback
  const pageTitle = product.metaTitle
    ? product.metaTitle
    : `${product.title} - Luxury ${product.category || "Perfume"} Impression | ${SITE_NAME}`;

  // 2. Dynamic Meta Description with Fallback
  const pageDescription = product.metaDescription
    ? product.metaDescription
    : product.description
    ? product.description.slice(0, 160).trim() + (product.description.length > 160 ? "..." : "")
    : `Buy ${product.title} luxury perfume impression at ${SITE_NAME}. Formulated with fine organic Grasse oils. Long-lasting scent with fast delivery.`;

  // 3. Canonical URL (slug preferred over ID)
  const canonicalUrl = `${SITE_URL}/product/${product.slug || product.id}`;

  // 4. Primary Image for OG / Twitter
  const ogImage = product.productImage || `${SITE_URL}/m.z.jpg`;

  return (
    <SEO
      title={pageTitle}
      description={pageDescription}
      canonicalUrl={canonicalUrl}
      ogType="product"
      ogImage={ogImage}
    >
      <ProductSchema product={product} />
    </SEO>
  );
};

export default ProductSEO;
