import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, PackagePlus, Package, ClipboardList, Star, Mail, Quote, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/product", label: "Add Product", icon: PackagePlus },
  { to: "/admin/products", label: "All Products", icon: Package },
  { to: "/admin/orders", label: "Order Management", icon: ClipboardList },
  { to: "/admin/reviews", label: "Review Management", icon: Star },
  { to: "/admin/contact-messages", label: "Contact Messages", icon: Mail },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/newsletter", label: "Newsletter", icon: Send },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Body scroll-lock jab mobile sidebar open ho
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Route change pe sidebar band karo
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile hamburger toggle — min 44×44px tap area */}
      <button
        id="sidebar-toggle"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        className="md:hidden fixed top-4 left-4 z-50 w-11 h-11 flex items-center justify-center rounded-lg bg-luxury-card border border-luxury-gold/20 text-luxury-cream shadow-lg hover:border-luxury-gold/40 transition-colors duration-200"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay — mobile only, backdrop blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-luxury-card border-r border-luxury-gold/10
          text-luxury-cream transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
        aria-label="Admin navigation"
      >
        {/* Brand header */}
        <div className="flex items-center h-16 px-5 bg-luxury-elevated border-b border-luxury-gold/10">
          <h2 className="font-logo text-lg font-bold text-luxury-cream">
            M.Z <span className="text-luxury-gold">Admin</span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 4rem)" }}>
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <li key={to} className="relative">
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-0 h-full w-1 rounded-r bg-luxury-gold"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <Link
                    to={to}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 min-h-[44px]
                      ${active
                        ? "bg-luxury-gold/10 text-luxury-gold font-medium"
                        : "text-luxury-cream/70 hover:bg-luxury-gold/5 hover:text-luxury-cream"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
