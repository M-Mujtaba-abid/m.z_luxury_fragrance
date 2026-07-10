// // src/components/layout/Navbar.tsx
// import React, { useEffect, useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../redux/store";
// import {
//   FiMenu,
//   FiX,
//   FiShoppingCart,
//   FiSearch,
//   FiMoreVertical,
//   FiChevronDown,
// } from "react-icons/fi";
// import { AnimatePresence, motion } from "framer-motion";
// import ThemeToggle from "../../ThemeToggle";
// import SearchBar from "./SearchBar";

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cartItems } = useSelector((s: RootState) => s.cart);

//   // UI state
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [insightsOpen, setInsightsOpen] = useState(false);
//   const [moreOpen, setMoreOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);

//   // refs for outside-click
//   const insightsRef = useRef<HTMLDivElement | null>(null);
//   const moreRef = useRef<HTMLDivElement | null>(null);
//   const searchRef = useRef<HTMLDivElement | null>(null);

//   // close dropdowns on outside click
//   useEffect(() => {
//     const onDocClick = (e: MouseEvent) => {
//       if (insightsRef.current && !insightsRef.current.contains(e.target as Node)) {
//         setInsightsOpen(false);
//       }
//       if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
//         setMoreOpen(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
//         setSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, []);

//   // close popovers on route change
//   useEffect(() => {
//     setInsightsOpen(false);
//     setMoreOpen(false);
//     setMobileOpen(false);
//     setSearchOpen(false);
//   }, [location.pathname]);

//   const links = [
//     { name: "Home", path: "/web" },
//     { name: "About", path: "/web/about" },
//     { name: "Contact Us", path: "/web/contact" },
//   ];

//   const insightsLinks = [
//     { name: "Men", path: "/web/men" },
//     { name: "Women", path: "/web/women" },
//     { name: "Children", path: "/web/children" },
//     { name: "Featured", path: "/web/all-products", state: { category: "featured" } },
//     { name: "On Sale", path: "/web/all-products", state: { category: "onSale" } },
//     { name: "New Arrivals", path: "/web/all-products", state: { category: "newArrival" } },
//   ];

//   const isActive = (path: string) => location.pathname === path;

//   const handleCartClick = () => navigate("/web/cart");

//   return (
//     <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-[80px] items-center justify-between">
//           {/* Left — Logo */}
//           <button
//             onClick={() => navigate("/web")}
//             className="flex items-center space-x-2 group"
//             aria-label="Go to homepage"
//           >
//             <img
//               src="/logoCrop.jpg"
//               alt="M.Z"
//               className="h-10 w-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition"
//             />
//             <span className="font-logo text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
//               M.Z Luxury Fragrance
//             </span>
//           </button>

//           {/* Center — Desktop nav */}
//           <div className="hidden md:flex items-center space-x-8">
//             {links.map((l) => (
//               <Link
//                 key={l.name}
//                 to={l.path}
//                 className={`relative text-sm font-medium transition-colors ${
//                   isActive(l.path)
//                     ? "text-blue-600 dark:text-blue-400"
//                     : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
//                 }`}
//               >
//                 {l.name}
//                 {isActive(l.path) && (
//                   <span className="absolute left-0 -bottom-1 h-0.5 w-full rounded bg-blue-600 dark:bg-blue-400" />
//                 )}
//               </Link>
//             ))}

//             {/* Insights dropdown */}
//             <div
//               className="relative"
//               ref={insightsRef}
//               onMouseEnter={() => setInsightsOpen(true)}
//               onMouseLeave={() => setInsightsOpen(false)}
//             >
//               <button
//                 onClick={() => setInsightsOpen((s) => !s)}
//                 className={`flex items-center gap-1 text-sm font-medium transition-colors ${
//                   location.pathname.startsWith("/web/men") ||
//                   location.pathname.startsWith("/web/women") ||
//                   location.pathname.startsWith("/web/children") ||
//                   location.pathname.startsWith("/web/all-products")
//                     ? "text-blue-600 dark:text-blue-400"
//                     : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
//                 }`}
//                 aria-haspopup="menu"
//                 aria-expanded={insightsOpen}
//               >
//                 Insights <FiChevronDown className={`transition ${insightsOpen ? "rotate-180" : ""}`} />
//               </button>

//               <AnimatePresence>
//                 {insightsOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 8 }}
//                     transition={{ duration: 0.18, ease: "easeOut" }}
//                     className="absolute left-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-lg dark:border-gray-700/70 dark:bg-gray-800"
//                   >
//                     <ul className="py-2">
//                       {insightsLinks.map((link) => (
//                         <li key={link.name}>
//                           <Link
//                             to={link.path}
//                             state={link.state}
//                             className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700/60 dark:hover:text-blue-300"
//                           >
//                             {link.name}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Right — Desktop actions (Search, Cart, Theme, More) */}
//           <div className="hidden md:flex items-center gap-3">
//             {/* Search */}
//             <div className="relative" ref={searchRef}>
//               <button
//                 onClick={() => setSearchOpen((s) => !s)}
//                 className="group relative rounded-full p-2 ring-1 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800"
//                 aria-label="Search"
//               >
//                 <FiSearch className="h-5 w-5 text-gray-700 transition group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400" />
//               </button>

//               <AnimatePresence>
//                 {searchOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 8 }}
//                     transition={{ duration: 0.18, ease: "easeOut" }}
//                     className="absolute right-0 mt-6 w-80 overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-lg dark:border-gray-700/70 dark:bg-gray-800"
//                   >
//                     <SearchBar closeSearch={() => setSearchOpen(false)} />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Cart */}
//             <button
//               onClick={handleCartClick}
//               className="group relative rounded-full p-2 ring-1 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800"
//               aria-label="Cart"
//             >
//               <FiShoppingCart className="h-5 w-5 text-gray-700 transition group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400" />
//               {!!cartItems?.length && (
//                 <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
//                   {cartItems.length}
//                 </span>
//               )}
//             </button>

//             {/* Theme */}
//             <ThemeToggle />

//             {/* More */}
//             <div className="relative" ref={moreRef}>
//               <button
//                 onClick={() => setMoreOpen((s) => !s)}
//                 className="rounded-full p-2 ring-1 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800"
//                 aria-haspopup="menu"
//                 aria-expanded={moreOpen}
//                 aria-label="More"
//               >
//                 <FiMoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-200" />
//               </button>

//               <AnimatePresence>
//                 {moreOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 8 }}
//                     transition={{ duration: 0.18, ease: "easeOut" }}
//                     className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-lg dark:border-gray-700/70 dark:bg-gray-800"
//                     role="menu"
//                   >
//                     <Link
//                       to="/web/profile"
//                       className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60"
//                       role="menuitem"
//                     >
//                       Profile
//                     </Link>
//                     <Link
//                       to="/web/myorders"
//                       className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60"
//                       role="menuitem"
//                     >
//                       My Orders
//                     </Link>
//                     <button
//                       onClick={() => navigate("/web/login")}
//                       className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
//                       role="menuitem"
//                     >
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Mobile — Search, Cart, Hamburger */}
//           <div className="flex items-center gap-2 md:hidden" >
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setSearchOpen((s) => !s);
//               }}
//               className="rounded-full p-2"
//               aria-label="Search"
//             >
//               <FiSearch className="h-6 w-6 text-gray-800 dark:text-gray-100" />
//             </button>

//             <button
//               onClick={handleCartClick}
//               className="relative rounded-full p-2"
//               aria-label="Cart"
//             >
//               <FiShoppingCart className="h-6 w-6 text-gray-800 dark:text-gray-100" />
//               {!!cartItems?.length && (
//                 <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
//                   {cartItems.length}
//                 </span>
//               )}
//             </button>

//             <button
//               onClick={() => setMobileOpen((s) => !s)}
//               className="rounded-md p-2"
//               aria-label="Open menu"
//             >
//               {mobileOpen ? (
//                 <FiX className="h-6 w-6 text-gray-800 dark:text-gray-100" />
//               ) : (
//                 <FiMenu className="h-6 w-6 text-gray-800 dark:text-gray-100" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile sheet */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="md:hidden overflow-hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
//           >
//             <div className="px-4 py-3">
//               <nav className="grid gap-1">
//                 {links.map((l) => (
//                   <Link
//                     key={l.name}
//                     to={l.path}
//                     className="rounded px-3 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
//                   >
//                     {l.name}
//                   </Link>
//                 ))}
//                 {insightsLinks.map((l) => (
//                   <Link
//                     key={l.name}
//                     to={l.path}
//                     state={l.state}
//                     className="rounded px-3 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
//                   >
//                     {l.name}
//                   </Link>
//                 ))}

//                 {/* Theme toggle */}
//                 <div className="px-1 py-2">
//                   <ThemeToggle />
//                 </div>

//                 <Link
//                   to="/web/profile"
//                   className="rounded px-3 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
//                 >
//                   Profile
//                 </Link>
//                 <button
//                   onClick={() => navigate("/web/login")}
//                   className="rounded px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
//                 >
//                   Logout
//                 </button>
//               </nav>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Mobile Search Dropdown */}
//       <AnimatePresence>
//         {searchOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.2 }}
//             className="md:hidden absolute top-[80px] inset-x-0 bg-white dark:bg-gray-900 shadow-md z-50"
//             ref={searchRef}
//           >
//             <SearchBar closeSearch={() => setSearchOpen(false)} />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;




// src/components/layout/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiSearch,
  FiMoreVertical,
  FiChevronDown,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "../../ThemeToggle";
import SearchBar from "./SearchBar";
import { logoutUser } from "../../redux/auth/AuthThunk";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { cartItems } = useSelector((s: RootState) => s.cart);
  const { token } = useSelector((s: RootState) => s.user);

  // UI state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // refs for outside-click
  const insightsRef = useRef<HTMLDivElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // close dropdowns on outside click
// Update the useEffect for outside click detection
useEffect(() => {
  const onDocClick = (e: MouseEvent) => {
    // Only close if the click is outside all dropdown containers
    if (insightsRef.current && !insightsRef.current.contains(e.target as Node)) {
      setInsightsOpen(false);
    }
    if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
      setMoreOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setSearchOpen(false);
    }
  };
  
  // Use a timeout to avoid immediate closing when opening the dropdown
  const timer = setTimeout(() => {
    document.addEventListener("click", onDocClick);
  }, 100);
  
  return () => {
    clearTimeout(timer);
    document.removeEventListener("click", onDocClick);
  };
}, []);

  // close popovers on route change
  useEffect(() => {
    setInsightsOpen(false);
    setMoreOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const links = [
    { name: "Home", path: "/web" },
    { name: "About", path: "/web/about" },
    { name: "Contact Us", path: "/web/contact" },
  ];

  const insightsLinks = [
    { name: "Men", path: "/web/men" },
    { name: "Women", path: "/web/women" },
    { name: "Children", path: "/web/children" },
    { name: "Featured", path: "/web/all-products", state: { category: "featured" } },
    { name: "On Sale", path: "/web/all-products", state: { category: "onSale" } },
    { name: "New Arrivals", path: "/web/all-products", state: { category: "newArrival" } },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleCartClick = () => navigate("/web/cart");

  const handleAuthClick = async () => {
    if (token) {
      try {
        await dispatch(logoutUser()).unwrap();
      } catch (_) {}
      navigate("/login");
    } else {
      navigate("/login");
    }
    setMoreOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[80px] items-center justify-between">
          {/* Left — Logo */}
          <button
            onClick={() => navigate("/web")}
            className="flex items-center space-x-2 group"
            aria-label="Go to homepage"
          >
            <img
              src="/logoCrop.jpg"
              alt="M.Z"
              className="h-10 w-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition"
            />
            <span className="font-logo text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              M.Z Luxury Fragrance
            </span>
          </button>

          {/* Center — Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((l) => (
              <Link
                key={l.name}
                to={l.path}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(l.path)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {l.name}
                {isActive(l.path) && (
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full rounded bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            ))}

            {/* Insights dropdown */}
            <div
              className="relative"
              ref={insightsRef}
              onMouseEnter={() => setInsightsOpen(true)}
              onMouseLeave={() => setInsightsOpen(false)}
            >
              <button
                onClick={() => setInsightsOpen((s) => !s)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  location.pathname.startsWith("/web/men") ||
                  location.pathname.startsWith("/web/women") ||
                  location.pathname.startsWith("/web/children") ||
                  location.pathname.startsWith("/web/all-products")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                aria-haspopup="menu"
                aria-expanded={insightsOpen}
              >
                Insights <FiChevronDown className={`transition ${insightsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {insightsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-lg dark:border-gray-700/70 dark:bg-gray-800"
                  >
                    <ul className="py-2">
                      {insightsLinks.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.path}
                            state={link.state}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700/60 dark:hover:text-blue-300"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right — Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            {/* Update the search section in the desktop navigation */}
<div className="relative" ref={searchRef}>
  <button
    onClick={(e) => {
      e.stopPropagation();
      setSearchOpen((s) => !s);
    }}
    className="group relative rounded-full p-2 ring-1 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800"
    aria-label="Search"
  >
    <FiSearch className="h-5 w-5 text-gray-700 transition group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400" />
  </button>

  <AnimatePresence>
    {searchOpen && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute right-0 mt-6 w-80 overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-lg dark:border-gray-700/70 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()} // Add this line
      >
        <SearchBar closeSearch={() => setSearchOpen(false)} />
      </motion.div>
    )}
  </AnimatePresence>
</div>
            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="group relative rounded-full p-2 ring-1 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800"
              aria-label="Cart"
            >
              <FiShoppingCart className="h-5 w-5 text-gray-700 transition group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400" />
              {!!cartItems?.length && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Theme */}
            <ThemeToggle />

            {/* More */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((s) => !s)}
                className="rounded-full p-2 ring-1 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                aria-label="More"
              >
                <FiMoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-lg dark:border-gray-700/70 dark:bg-gray-800"
                    role="menu"
                  >
                    <Link
                      to="/web/profile"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60"
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/web/myorders"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60"
                      role="menuitem"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleAuthClick}
                      className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      role="menuitem"
                    >
                      {token ? "Logout" : "Login"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen((s) => !s);
              }}
              className="rounded-full p-2"
              aria-label="Search"
            >
              <FiSearch className="h-6 w-6 text-gray-800 dark:text-gray-100" />
            </button>

            <button
              onClick={handleCartClick}
              className="relative rounded-full p-2"
              aria-label="Cart"
            >
              <FiShoppingCart className="h-6 w-6 text-gray-800 dark:text-gray-100" />
              {!!cartItems?.length && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="rounded-md p-2"
              aria-label="Open menu"
            >
              {mobileOpen ? (
                <FiX className="h-6 w-6 text-gray-800 dark:text-gray-100" />
              ) : (
                <FiMenu className="h-6 w-6 text-gray-800 dark:text-gray-100" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="px-4 py-3">
              <nav className="grid gap-1">
                {links.map((l) => (
                  <Link
                    key={l.name}
                    to={l.path}
                    className="rounded px-3 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    {l.name}
                  </Link>
                ))}
                {insightsLinks.map((l) => (
                  <Link
                    key={l.name}
                    to={l.path}
                    state={l.state}
                    className="rounded px-3 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    {l.name}
                  </Link>
                ))}

                <div className="px-1 py-2">
                  <ThemeToggle />
                </div>

                <Link
                  to="/web/profile"
                  className="rounded px-3 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  Profile
                </Link>
                <button
                  onClick={handleAuthClick}
                  className="rounded px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  {token ? "Logout" : "Login"}
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[80px] inset-x-0 bg-white dark:bg-gray-900 shadow-md z-50"
            ref={searchRef}
          >
            <SearchBar closeSearch={() => setSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
