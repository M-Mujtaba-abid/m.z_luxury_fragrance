// src/components/ui/SEO.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Re-export / delegation wrapper pointing to the clean React Helmet SEO architecture
// in `src/seo/SEO.tsx`. Preserves 100% backwards compatibility for legacy components.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import BaseSEO, { type SEOProps as BaseSEOProps } from "../../seo/SEO";

export interface SEOProps extends BaseSEOProps {
  schemaData?: object;
}

export const SEO: React.FC<SEOProps> = ({ schemaData, children, ...props }) => {
  return (
    <BaseSEO {...props}>
      {children}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
    </BaseSEO>
  );
};

export default SEO;
