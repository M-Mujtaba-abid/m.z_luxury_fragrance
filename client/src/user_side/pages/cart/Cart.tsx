

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../../redux/user/cart/CartThunk";
import { clearError, updateItemQuantityLocally } from "../../../redux/user/cart/CartSlice";
import type { RootState, AppDispatch } from "../../../redux/store";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { cartItems,  error } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(getUserCart());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);


  
  //   if (newQuantity < 1) return;
  //   try {
  //     await dispatch(updateCartItem({ id: itemId, quantity: newQuantity })).unwrap();
  //   } catch (err) {
  //     console.error("Failed to update quantity:", err);
  //   }
  // };
  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
  
    // 1. Optimistic update
    dispatch(updateItemQuantityLocally({ id: itemId, quantity: newQuantity }));
  
    try {
      // 2. Backend update
      await dispatch(updateCartItem({ id: itemId, quantity: newQuantity })).unwrap();
    } catch (err) {
      console.error("Failed to update quantity:", err);
  
      // 3. Rollback (refetch if failed)
      dispatch(getUserCart());
    }
  };
  
  const handleRemoveItem = async (itemId: number) => {
    try {
      await dispatch(removeCartItem(itemId)).unwrap();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await dispatch(clearCart()).unwrap();
      } catch (err) {
        console.error("Failed to clear cart:", err);
      }
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((total: number, item: any) => total + item.totalPrice, 0);


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100  dark:bg-gray-900 py-12 px-4">
        <div className="max-w-lg mx-auto text-center mt-12">
          <ShoppingBag className="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={() => navigate("/web")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[80px] bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
            Shopping Cart ({cartItems.length} items)
          </h1>
         
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          

<div className="flex-1 space-y-4 flex flex-col items-center justify-center">
  {cartItems.map((item: any) => (
    <div
      key={item.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md 
                 p-4 sm:p-6 w-full max-w-3xl
                 flex flex-col sm:flex-row items-center sm:items-center 
                 justify-between gap-4 sm:gap-6"
    >
      <img
        src={item.Product?.productImage}
        alt={item.Product?.title}
        className="w-28 h-20 sm:w-28 sm:h-28 object-cover rounded-lg"
      />

      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
        {/* Title + Price */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate sm:truncate-none">
            {item.Product?.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
            Price: Rs. {item.priceAtAddition}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-400 dark:border-gray-600 rounded-lg h-10 mx-auto sm:mx-0">
          <button
            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Minus className="w-4 dark:text-white h-4" />
          </button>
          <span className="w-10 text-center font-semibold text-gray-800 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Plus className="w-4 h-4 dark:text-white" />
          </button>
        </div>

        {/* Total + Remove */}
        <div className="flex items-center justify-center sm:justify-end gap-4">
          <p className="text-gray-800 dark:text-white font-bold text-sm sm:text-base">
            Rs. {item.totalPrice}
          </p>
          <button
            onClick={() => handleRemoveItem(item.id)}
            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-semibold dark:text-white">Rs. {calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className="font-semibold dark:text-white">Free</span>
                </div>
                <hr className="border-gray-300 dark:border-gray-600" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="dark:text-white">  Total:</span>
                  <span className="dark:text-white" >Rs. {calculateTotal()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/web/checkout")}
                className="w-full bg-blue-600 dark:bg-blue-500 text-white dark:text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

          
        </div>
        <button
            onClick={handleClearCart}
            className="px-3 mt-3 w-full py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm sm:text-base"
          >
            Clear Cart
          </button>
      </div>
    </div>
  );
};

export default Cart;
