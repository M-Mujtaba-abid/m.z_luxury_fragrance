import React, { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  schemaData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "M.Z Luxury Fragrances - Discover our curated collections of premium perfume impressions formulated with organic Grasse oils.",
  canonicalUrl,
  ogType = "website",
  ogImage = "https://m-z-luxury-fragrance.vercel.app/m.z.jpg",
  schemaData,
}) => {
  useEffect(() => {
    // 1. Title
    const formattedTitle = `${title} | M.Z Luxury Fragrances`;
    document.title = formattedTitle;

    // Helper to select/create meta tags
    const setMetaTag = (attributeName: string, attributeValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // Helper to select/create link tags
    const setLinkTag = (relValue: string, hrefValue: string) => {
      let element = document.querySelector(`link[rel="${relValue}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", relValue);
        document.head.appendChild(element);
      }
      element.setAttribute("href", hrefValue);
    };

    // 2. Meta Description
    setMetaTag("name", "description", description);

    // 3. OpenGraph Tags
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:image", ogImage);
    
    // 4. Twitter Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 5. Canonical Link
    const currentCanonical = canonicalUrl || window.location.href;
    setLinkTag("canonical", currentCanonical);

    // 6. JSON-LD Structured Schema Data
    let schemaScript = document.getElementById("json-ld-schema") as HTMLScriptElement;
    if (schemaScript) {
      schemaScript.textContent = "";
    } else {
      schemaScript = document.createElement("script");
      schemaScript.id = "json-ld-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "M.Z Luxury Fragrances",
      "description": "An international premium luxury ecommerce store presenting fine perfume impressions.",
      "url": "https://m-z-luxury-fragrance.vercel.app",
      "logo": "https://m-z-luxury-fragrance.vercel.app/m.z.jpg",
      "sameAs": [
        "https://www.instagram.com/m.z.luxury",
        "https://www.facebook.com/m.z.luxury"
      ]
    };

    schemaScript.textContent = JSON.stringify(schemaData || defaultSchema);

    return () => {
      // Clean up dynamic schema tags on unmount
      if (schemaScript) {
        schemaScript.textContent = "";
      }
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schemaData]);

  return null; // Side effect only component
};

export default SEO;
