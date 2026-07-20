import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, PackagePlus, Package, ClipboardList, Star, Mail, Quote } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/product", label: "Add Product", icon: PackagePlus },
  { to: "/admin/products", label: "All Products", icon: Package },
  { to: "/admin/orders", label: "Order Management", icon: ClipboardList },
  { to: "/admin/reviews", label: "Review Management", icon: Star },
  { to: "/admin/contact-messages", label: "Contact Messages", icon: Mail },
  { to: "/admin/testimonials", label: "Testimonials t", icon: Quote },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-luxury-card border border-luxury-gold/20 text-luxury-cream"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-luxury-card border-r border-luxury-gold/10 text-luxury-cream transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-5 bg-luxury-elevated border-b border-luxury-gold/10">
          <h2 className="font-logo text-lg font-bold text-luxury-cream">
            M.Z <span className="text-luxury-gold">Admin</span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
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
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-300 ${active
                        ? "bg-luxury-gold/10 text-luxury-gold font-medium"
                        : "text-luxury-cream/70 hover:bg-luxury-gold/5 hover:text-luxury-cream"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
