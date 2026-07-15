import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../../redux/store";
import { trackGuestOrder } from "../../redux/thunks/OrderThunk";
import { clearTrackedOrder } from "../../redux/slices/OrderSlice";
import { Search } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  confirmed: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  shipped: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  delivered: "bg-green-500/15 text-green-300 border border-green-500/30",
  cancelled: "bg-red-500/15 text-red-300 border border-red-500/30",
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
    <div className="min-h-screen pt-[80px] bg-luxury-ink py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-logo text-3xl font-bold text-luxury-cream mb-2">
          Track Your Order
        </h1>
        <p className="text-luxury-cream/70 mb-8">
          Enter your Order ID and the email you used at checkout — no login needed.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md p-6 mb-8 space-y-4"
        >
          <input
            type="number"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
          />
          <input
            type="email"
            placeholder="Email used at checkout"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-luxury-gold text-luxury-ink font-semibold py-3 rounded-lg hover:bg-luxury-gold-bright transition-colors duration-300 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-300 rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {trackedOrder && (
          <div className="bg-luxury-elevated border border-luxury-gold/10 shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-logo text-lg font-semibold text-luxury-gold">
                Order #{trackedOrder.id}
              </h2>
              <span className="text-sm text-luxury-cream/50">
                {new Date(trackedOrder.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mb-4 text-sm text-luxury-cream/80">
              <p>
                <span className="font-medium text-luxury-gold">Delivery Address:</span>{" "}
                <span className="text-luxury-cream">
                  {trackedOrder.shippingStreet}, {trackedOrder.shippingCity}
                </span>
              </p>
            </div>

            <div className="divide-y divide-luxury-gold/10">
              {trackedOrder.OrderItems?.map((item: any) => (
                <div key={item.id} className="flex items-center py-3 gap-4">
                  <img
                    src={item.Product?.productImage}
                    alt={item.Product?.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-luxury-cream font-medium">
                      {item.Product?.title}
                    </h3>
                    <p className="text-sm text-luxury-cream/60">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-luxury-gold">
                    Rs. {item.priceAtPurchase * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end font-semibold text-luxury-cream">
              <span className="font-bold">Total: </span>
              <span className="text-luxury-gold">Rs. {trackedOrder.totalAmount}</span>
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
