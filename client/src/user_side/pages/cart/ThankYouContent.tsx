import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import type { RootState } from "../../../redux/store";
import { CheckCircle } from "lucide-react";

const ThankYouContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state: RootState) => state.user);

  const userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const { orderId, email } =
    (location.state as { orderId?: number; email?: string }) || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
        {/* Success Icon */}
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />

        {/* Thank You Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 Thank You for Your Order!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {userName
            ? `${userName}, your order has been placed successfully.`
            : "Your order has been placed successfully."}
        </p>

        {orderId && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">#{orderId}</p>
          </div>
        )}

        {!token && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Save your Order ID and email — you can track your order anytime without logging in.
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/web")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>

          {token ? (
            <Link
              to="/web/myorders"
              className="px-6 py-3 rounded-lg border border-gray-400 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Track My Orders
            </Link>
          ) : (
            <Link
              to="/web/track-order"
              state={{ orderId, email }}
              className="px-6 py-3 rounded-lg border border-gray-400 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Track My Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThankYouContent;
