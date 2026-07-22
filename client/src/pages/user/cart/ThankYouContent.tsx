import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import type { RootState } from "../../../redux/store";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const ThankYouContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state: RootState) => state.user);

  const userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const { orderId, email } =
    (location.state as { orderId?: number; email?: string }) || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-ink px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-luxury-card border border-luxury-gold/20 shadow-lg rounded-2xl p-8 text-center max-w-md w-full"
      >
        {/* Success Icon, with a soft breathing gold glow behind it */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <motion.div
            className="absolute inset-0 rounded-full bg-luxury-gold/30 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
            className="relative"
          >
            <CheckCircle className="w-16 h-16 text-luxury-gold" />
          </motion.div>
        </div>

        {/* Thank You Message */}
        <h1 className="font-logo text-2xl font-bold text-luxury-cream mb-2">
          🎉 Thank You for Your Order!
        </h1>
        <p className="text-luxury-cream/70 mb-4">
          {userName
            ? `${userName}, your order has been placed successfully.`
            : "Your order has been placed successfully."}
        </p>

        {orderId && (
          <div className="bg-luxury-elevated border border-luxury-gold/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-luxury-cream/60">Order ID</p>
            <p className="text-xl font-bold text-luxury-gold">#{orderId}</p>
          </div>
        )}

        {!token && (
          <p className="text-sm text-luxury-cream/50 mb-6">
            Save your Order ID and email — you can track your order anytime without logging in.
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 transition-colors duration-300"
          >
            Continue Shopping
          </button>

          {token ? (
            <Link
              to="/myorders"
              className="px-6 py-3 rounded-lg bg-luxury-gold text-luxury-ink font-semibold hover:bg-luxury-gold-bright transition-colors duration-300"
            >
              Track My Orders
            </Link>
          ) : (
            <Link
              to="/track-order"
              state={{ orderId, email }}
              className="px-6 py-3 rounded-lg bg-luxury-gold text-luxury-ink font-semibold hover:bg-luxury-gold-bright transition-colors duration-300"
            >
              Track My Order
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYouContent;
