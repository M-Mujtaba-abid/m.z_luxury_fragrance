import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../../ThemeToggle";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 dark:bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-700 dark:bg-gray-800">
          <h2 className="font-bold text-lg">Admin Panel</h2>
          <ThemeToggle />
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive("/admin")
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/admin/product"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive("/admin/product")
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Add Product
              </Link>
            </li>

            <li>
              <Link
                to="/admin/products"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive("/admin/products")
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive("/admin/orders")
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Order Management
              </Link>
            </li>
            {/* <li>
              <Link
                to="/admin/products"
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive("/admin/products")
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                All Products
              </Link>
            </li> */}
          </ul>
        </nav>
      </aside>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
