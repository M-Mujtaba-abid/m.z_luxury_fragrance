
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideCartModal } from "../../../redux/user/cart/CartSlice";
import type { RootState, AppDispatch } from "../../../redux/store";
import { motion, AnimatePresence } from "framer-motion";

const CartModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showCartModal, lastAddedItem, cartItems } = useSelector(
    (state: RootState) => state.cart
  );

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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-2xl md:text-3xl mr-3 text-green-600"
                >
                  ✓
                </motion.span>
                <span className="font-semibold text-gray-800 dark:text-white text-sm md:text-base">
                  Item added to your cart
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-2xl hover:text-gray-600 dark:hover:text-gray-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ×
              </button>
            </div>
  
            {/* Product Info */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
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
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {lastAddedItem.quantity}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base lg:text-lg truncate md:truncate-none">
                  {lastAddedItem.Product?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                  Quantity: {lastAddedItem.quantity}
                </p>
                <p className="text-gray-800 dark:text-white font-semibold text-sm md:text-base">
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
                className="w-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                View cart ({cartItems.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
              >
                Check out
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinueShopping}
                className="w-full text-gray-600 dark:text-gray-400 underline hover:text-gray-800 dark:hover:text-white transition-colors py-2 text-sm md:text-base"
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
