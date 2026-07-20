
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideCartModal } from "../../../redux/slices/CartSlice";
import type { RootState, AppDispatch } from "../../../redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../../hooks/useCart";

const CartModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showCartModal, lastAddedItem } = useSelector(
    (state: RootState) => state.cart
  );
  // Read live cart count from React Query instead of stale Redux state
  const { cartItems } = useCart();

  const handleClose = () => {
    dispatch(hideCartModal());
  };

  const handleViewCart = () => {
    dispatch(hideCartModal());
    navigate("/web/cart");
  };

  const handleCheckout = () => {
    dispatch(hideCartModal());
    navigate("/web/checkout");
  };

  const handleContinueShopping = () => {
    dispatch(hideCartModal());
  };

  return (
    <AnimatePresence>
      {showCartModal && lastAddedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-luxury-elevated border border-luxury-gold/10 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-2xl md:text-3xl mr-3 text-luxury-gold"
                >
                  ✓
                </motion.span>
                <span className="font-semibold text-luxury-cream text-sm md:text-base">
                  Item added to your cart
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-2xl text-luxury-cream/70 hover:text-luxury-gold transition-colors duration-300 p-1 rounded-full hover:bg-luxury-gold/10"
              >
                ×
              </button>
            </div>

            {/* Product Info */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-luxury-card rounded-lg overflow-hidden border-2 border-luxury-gold/15">
                  <img
                    src={lastAddedItem.Product?.productImage}
                    alt={lastAddedItem.Product?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/80x80?text=No+Image";
                    }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-ink text-xs sm:text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {lastAddedItem.quantity}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-luxury-cream text-sm md:text-base lg:text-lg truncate md:truncate-none">
                  {lastAddedItem.Product?.title}
                </h3>
                <p className="text-luxury-cream/60 text-xs md:text-sm">
                  Quantity: {lastAddedItem.quantity}
                </p>
                <p className="text-luxury-gold font-semibold text-sm md:text-base">
                  Rs. {lastAddedItem.priceAtAddition}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewCart}
                className="w-full border-2 border-luxury-gold bg-transparent text-luxury-gold py-3 rounded-lg hover:bg-luxury-gold/10 transition-colors duration-300 font-medium"
              >
                View cart ({cartItems.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-luxury-gold text-luxury-ink py-3 rounded-lg hover:bg-luxury-gold-bright transition-colors duration-300 font-medium"
              >
                Check out
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinueShopping}
                className="w-full text-luxury-gold hover:underline transition-colors duration-300 py-2 text-sm md:text-base"
              >
                Continue shopping
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
};

export default CartModal;
