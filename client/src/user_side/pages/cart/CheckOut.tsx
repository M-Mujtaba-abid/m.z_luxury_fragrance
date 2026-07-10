
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../redux/store";
import { CreditCard, MapPin, User } from "lucide-react";
import { createOrder } from "../../../redux/Admin/AdminThunk/OrderThunk";
import { createCheckoutSession } from "../../../redux/payment/PaymentThunk";

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.user);
  const { loading, success, error } = useSelector(
    (state: RootState) => state.order
  );

  const [formData, setFormData] = useState({
    customerName: `${user?.firstName || ""} ${user?.lastName || ""}`,
    customerEmail: user?.email || "",
    customerPhone: user?.phoneNumber || "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "Pakistan",
    paymentMethod: "COD",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/web/cart");
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (success && formData.paymentMethod === "COD") {
      navigate("/web/thankyou");
    }
  }, [success, navigate, formData.paymentMethod]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total: number, item: any) => total + item.totalPrice,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.paymentMethod === "COD") {
      // 🔹 Normal COD order flow
      dispatch(createOrder({ ...formData, cartItems }));
    } else if (formData.paymentMethod === "CreditCard") {
      // 🔹 Stripe Payment Flow
      const resultAction = await dispatch(
        createCheckoutSession({
          items: cartItems.map((item: any) => ({
            name: item.Product?.title,
            price: item.totalPrice / item.quantity,
            quantity: item.quantity,
          })),
          userId: user.id,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingStreet: formData.shippingStreet,
          shippingCity: formData.shippingCity,
          shippingState: formData.shippingState,
          shippingPostalCode: formData.shippingPostalCode,
          shippingCountry: formData.shippingCountry,
          totalAmount: cartItems.reduce(
            (sum: number, item: any) => sum + item.totalPrice,
            0
          ),
        })
      );
      
  
      if (createCheckoutSession.fulfilled.match(resultAction)) {
        window.location.href = resultAction.payload.url; // ✅ Stripe checkout page
      }
    } else {
      alert("Other payment methods not yet implemented.");
    }
  };
  


  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto py-[50px] sm:py-0 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" /> Personal Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="customerName"
                  placeholder="Full Name"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="email"
                  name="customerEmail"
                  placeholder="Email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="tel"
                  name="customerPhone"
                  placeholder="Phone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="shippingStreet"
                  placeholder="Street Address"
                  value={formData.shippingStreet}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="shippingCity"
                    placeholder="City"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="shippingState"
                    placeholder="State"
                    value={formData.shippingState}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <input
                  type="text"
                  name="shippingPostalCode"
                  placeholder="Postal Code"
                  value={formData.shippingPostalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="shippingCountry"
                  placeholder="Country"
                  value={formData.shippingCountry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" /> Payment Method
              </h2>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="CreditCard">Credit Card</option>
                {/* <option value="PayPal">PayPal</option> */}
                {/* <option value="BankTransfer">Bank Transfer</option> */}
              </select>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold dark:text-white mb-4">Order Summary</h2>

              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center dark:text-white space-x-3 mb-3">
                  <img
                    src={item.Product?.productImage}
                    alt={item.Product?.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white">{item.Product?.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-white">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold dark:text-white">Rs. {item.totalPrice}</span>
                </div>
              ))}

              <hr className="my-4" />

              <div className="flex justify-between  dark:text-white font-bold text-lg mb-4">
                <span>Total:</span>
                <span>Rs. {calculateTotal()}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600  text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

              {error && (
                <p className="text-red-500 mt-3 text-sm">⚠ {error}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOut;
