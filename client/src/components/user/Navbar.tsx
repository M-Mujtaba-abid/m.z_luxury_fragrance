import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "./SearchBar";
import { logoutUser } from "../../redux/thunks/AuthThunk";

const NAV_LINKS = [
  { name: "Home", path: "/web" },
  { name: "Collection", path: "/web/all-products" },
  { name: "Story", path: "/web/about" },
  { name: "Contact", path: "/web/contact" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { cartItems } = useSelector((s: RootState) => s.cart);
  const { token } = useSelector((s: RootState) => s.user);

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

  // Solid background only after the page has scrolled past the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener("click", onDocClick), 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  // Close everything on route change
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const handleCartClick = () => navigate("/web/cart");

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (_) {
      // ignore - navigate away regardless
    }
    setAccountOpen(false);
    setDrawerOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-luxury-ink/95 backdrop-blur-md shadow-lg shadow-black/30"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo / wordmark */}
            <Link to="/web" className="group flex items-center" aria-label="Go to homepage">
              <span className="font-logo text-2xl md:text-3xl font-bold tracking-wide text-luxury-cream transition-colors duration-300 group-hover:text-luxury-gold">
                M.Z
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.name}
                  to={l.path}
                  className={`group relative text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive(l.path) ? "text-luxury-gold" : "text-luxury-cream/80 hover:text-luxury-gold"
                  }`}
                >
                  {l.name}
                  <span
                    className={`absolute left-0 -bottom-1.5 h-px bg-luxury-gold transition-all duration-300 ${
                      isActive(l.path) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop icons */}
            <div className="hidden md:flex items-center gap-6">
              <div className="relative" ref={searchRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchOpen((s) => !s);
                  }}
                  className="text-luxury-cream/80 hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Search"
                >
                  <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-5 w-80 overflow-hidden rounded-md border border-luxury-gold/20 bg-luxury-ink shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SearchBar closeSearch={() => setSearchOpen(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleCartClick}
                className="relative text-luxury-cream/80 hover:text-luxury-gold transition-colors duration-300"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {!!cartItems?.length && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-luxury-gold px-1 text-[10px] font-semibold text-luxury-ink">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {token ? (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccountOpen((s) => !s);
                    }}
                    className="text-luxury-cream/80 hover:text-luxury-gold transition-colors duration-300"
                    aria-label="Account"
                  >
                    <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </button>

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-5 w-44 overflow-hidden rounded-md border border-luxury-gold/20 bg-luxury-ink shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          to="/web/profile"
                          className="block px-4 py-3 text-xs uppercase tracking-widest text-luxury-cream/80 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-colors duration-300"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/web/myorders"
                          className="block px-4 py-3 text-xs uppercase tracking-widest text-luxury-cream/80 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-colors duration-300"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-3 text-left text-xs uppercase tracking-widest text-luxury-cream/80 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-colors duration-300"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs font-medium uppercase tracking-[0.2em] text-luxury-cream/80 hover:text-luxury-gold transition-colors duration-300"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden text-luxury-cream hover:text-luxury-gold transition-colors duration-300"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[80%] max-w-sm flex-col bg-luxury-ink shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-luxury-gold/15 px-6 py-6">
                <span className="font-logo text-xl font-bold text-luxury-cream">M.Z</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-luxury-cream/80 hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-6 py-8">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.name}
                    to={l.path}
                    className={`border-b border-luxury-gold/10 py-3 text-sm font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive(l.path) ? "text-luxury-gold" : "text-luxury-cream/80 hover:text-luxury-gold"
                    }`}
                  >
                    {l.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex items-center gap-6 border-t border-luxury-gold/15 px-6 py-6">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setSearchOpen(true);
                  }}
                  className="text-luxury-cream/80 hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" strokeWidth={1.5} />
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    handleCartClick();
                  }}
                  className="relative text-luxury-cream/80 hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                  {!!cartItems?.length && (
                    <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-luxury-gold px-1 text-[10px] font-semibold text-luxury-ink">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                {token && (
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate("/web/profile");
                    }}
                    className="text-luxury-cream/80 hover:text-luxury-gold transition-colors duration-300"
                    aria-label="Account"
                  >
                    <User className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                )}

                <button
                  onClick={token ? handleLogout : () => navigate("/login")}
                  className="ml-auto text-xs font-medium uppercase tracking-widest text-luxury-cream/70 hover:text-luxury-gold transition-colors duration-300"
                >
                  {token ? "Logout" : "Login"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && !drawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-20 z-40 bg-luxury-ink shadow-lg md:hidden"
          >
            <SearchBar closeSearch={() => setSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
