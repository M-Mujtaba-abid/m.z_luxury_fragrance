// src/seo/ProductSchema.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Generates Schema.org Product JSON-LD script tag following Google Search Console
// structured data requirements.
// Includes aggregateRating ONLY if reviewCount > 0.
// Strips undefined/null/empty fields to guarantee clean schema validation.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import type { Product } from "../redux/types/productTypes";
import { SITE_NAME, SITE_URL } from "./constants";

interface ProductSchemaProps {
  product: Product;
}

// Utility function to remove undefined, null, or empty object properties
const cleanSchemaObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(cleanSchemaObject).filter((item) => item != null);
  }
  if (typeof obj === "object" && obj !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null && value !== "") {
        const cleanedValue = cleanSchemaObject(value);
        if (
          typeof cleanedValue !== "object" ||
          cleanedValue === null ||
          Object.keys(cleanedValue).length > 0 ||
          Array.isArray(cleanedValue)
        ) {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }
  return obj;
};

export const ProductSchema: React.FC<ProductSchemaProps> = ({ product }) => {
  if (!product) return null;

  // Determine canonical product URL
  const productUrl = `${SITE_URL}/product/${product.slug || product.id}`;

  // Calculate actual price considering sale discounts
  const activePrice =
    product.isOnSale && product.discountPrice
      ? product.discountPrice
      : product.price;

  // Collect image array (primary image + gallery images if present)
  const imageList: string[] = [];
  if (product.productImage) imageList.push(product.productImage);
  if (product.ProductImages && product.ProductImages.length > 0) {
    product.ProductImages.forEach((img) => {
      if (img.imageUrl && !imageList.includes(img.imageUrl)) {
        imageList.push(img.imageUrl);
      }
    });
  }

  // Stock availability
  const availability =
    product.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  // Build raw schema
  const rawSchema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.metaDescription || product.description,
    image: imageList.length === 1 ? imageList[0] : imageList,
    sku: product.id ? product.id.toString() : undefined,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: product.brand || SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "PKR",
      price: activePrice,
      availability: availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };

  // Add aggregateRating ONLY if reviewCount > 0
  if (product.reviewCount && product.reviewCount > 0) {
    rawSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (product.averageRating ?? 5.0).toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  const cleanedSchema = cleanSchemaObject(rawSchema);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanedSchema) }}
    />
  );
};

export default ProductSchema;
