// src/seo/OrganizationSchema.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Generates Schema.org Organization/Store JSON-LD script tag for the homepage.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  SOCIAL_LINKS,
} from "./constants";

export const OrganizationSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    description: DEFAULT_DESCRIPTION,
    priceRange: "$$",
    currenciesAccepted: "PKR",
    sameAs: SOCIAL_LINKS,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default OrganizationSchema;
