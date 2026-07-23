// src/seo/SEO.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable React Helmet wrapper for page-level title, meta tags, OpenGraph,
// Twitter cards, and canonical links.
// NO Product Schema here (handled cleanly via ProductSEO & ProductSchema).
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
} from "./constants";

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  robots?: string;
  children?: React.ReactNode;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  robots = "index, follow",
  children,
}) => {
  // Format title: if title is provided and doesn't already contain SITE_NAME, append brand
  const formattedTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;

  // Resolve canonical URL — default to current site URL if not specified
  const canonical = canonicalUrl
    ? canonicalUrl.startsWith("http")
      ? canonicalUrl
      : `${SITE_URL}${canonicalUrl.startsWith("/") ? "" : "/"}${canonicalUrl}`
    : SITE_URL;

  // Ensure image URL is absolute
  const image = ogImage.startsWith("http")
    ? ogImage
    : `${SITE_URL}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Nested Schemas / Additional Head Elements */}
      {children}
    </Helmet>
  );
};

export default SEO;
