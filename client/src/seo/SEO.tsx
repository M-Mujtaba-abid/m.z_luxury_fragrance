// src/seo/SEO.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable SEO component for page-level title, meta tags, OpenGraph,
// Twitter cards, and canonical links using React 19 native document metadata hoisting.
// Completely eliminates third-party dependencies (like react-helmet-async) that
// cause white screen crashes in React 19.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
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

  // Resolve canonical URL safely
  const resolvedCanonical = canonicalUrl || SITE_URL;
  const canonical = resolvedCanonical.startsWith("http")
    ? resolvedCanonical
    : `${SITE_URL}${resolvedCanonical.startsWith("/") ? "" : "/"}${resolvedCanonical}`;

  // Ensure image URL is absolute & safe
  const resolvedOgImage = ogImage || DEFAULT_IMAGE;
  const image = resolvedOgImage.startsWith("http")
    ? resolvedOgImage
    : `${SITE_URL}${resolvedOgImage.startsWith("/") ? "" : "/"}${resolvedOgImage}`;

  const safeDescription = description || DEFAULT_DESCRIPTION;

  return (
    <>
      {/* React 19 natively hoists <title>, <meta>, and <link> tags directly to <head> */}
      <title>{formattedTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={image} />

      {/* Nested Schemas / Additional Head Elements */}
      {children}
    </>
  );
};

export default SEO;
