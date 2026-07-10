import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../../redux/store";
import { trackGuestOrder } from "../../redux/Admin/AdminThunk/OrderThunk";
import { clearTrackedOrder } from "../../redux/Admin/AdminSlice/OrderSlice";
import { Search } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100",
  confirmed: "bg-indigo-200 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-100",
  shipped: "bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-100",
  delivered: "bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-100",
  cancelled: "bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-100",
};

const OrderTracking: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const initial = (location.state as { orderId?: number; email?: string }) || {};

  const [orderId, setOrderId] = useState(initial.orderId ? String(initial.orderId) : "");
  const [email, setEmail] = useState(initial.email || "");

  const { trackedOrder, loading, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (initial.orderId && initial.email) {
      dispatch(trackGuestOrder({ id: initial.orderId, email: initial.email }));
    }
    return () => {
      dispatch(clearTrackedOrder());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;
    dispatch(trackGuestOrder({ id: orderId, email }));
  };

  return (
    <div className="min-h-screen pt-[80px] bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Track Your Order
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Enter your Order ID and the email you used at checkout — no login needed.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 space-y-4"
        >
          <input
            type="number"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="email"
            placeholder="Email used at checkout"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {trackedOrder && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{trackedOrder.id}
              </h2>
              <span className="text-sm text-gray-500">
                {new Date(trackedOrder.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-medium">Delivery Address:</span>{" "}
                {trackedOrder.shippingStreet}, {trackedOrder.shippingCity}
              </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {trackedOrder.OrderItems?.map((item: any) => (
                <div key={item.id} className="flex items-center py-3 gap-4">
                  <img
                    src={item.Product?.productImage}
                    alt={item.Product?.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white font-medium">
                      {item.Product?.title}
                    </h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Rs. {item.priceAtPurchase * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end font-semibold text-gray-900 dark:text-white">
              <span className="font-bold">Total: </span>
              <span>Rs. {trackedOrder.totalAmount}</span>
            </div>

            <div className="mt-4 flex justify-end">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide ${
                  statusStyles[trackedOrder.status] || ""
                }`}
              >
                {trackedOrder.status.charAt(0).toUpperCase() + trackedOrder.status.slice(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
