import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Reusable trail for deep/nested pages only — top-level pages (Home, main
// listing pages) should not render this. The last item is always plain
// text (current page), everything before it links via react-router.
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`mb-4 ${className}`}>
      <ol
        className="flex items-center gap-x-1.5 text-xs sm:text-sm overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = isLast || !item.path;

          return (
            <li key={index} className="flex items-center gap-1.5 shrink-0">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-luxury-gold/30 shrink-0" />}
              {isCurrent ? (
                <span
                  className="flex items-center gap-1.5 text-luxury-gold font-medium"
                  aria-current="page"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path!}
                  className="flex items-center gap-1.5 text-luxury-cream/60 hover:text-luxury-gold-bright transition-colors duration-300"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
