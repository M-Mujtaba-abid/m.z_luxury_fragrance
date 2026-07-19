
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../../redux/store";
import {
  fetchOrderById,
  updateOrderStatus,
} from "../../../redux/thunks/OrderThunk";
import OrderSlip from "./OrderSlip";
import Breadcrumb from "../../../components/ui/Breadcrumb";

// Same status color language used on Order Tracking / admin Order Directory.
const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  confirmed: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  shipped: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  delivered: "bg-green-500/15 text-green-300 border border-green-500/30",
  cancelled: "bg-red-500/15 text-red-300 border border-red-500/30",
};

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const { order } = useSelector((state: RootState) => state.order);
  const { loading } = useSelector((state: RootState) => state.loader);

  const [status, setStatus] = useState(order?.status || "pending");

  useEffect(() => {
    if (id) dispatch(fetchOrderById(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (order?.id)
      dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-ink">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/admin" },
          { label: "Orders", path: "/admin/orders" },
          { label: `Order #${order.id}` },
        ]}
      />

      <div className="bg-luxury-card border border-luxury-gold/10 shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-logo text-2xl font-bold text-luxury-gold">
            Order #{order.id}
          </h1>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide capitalize ${
              statusStyles[status] || ""
            }`}
          >
            {status}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          {/* Customer Info */}
          <p>
            <span className="font-semibold text-luxury-gold">Customer Name:</span>{" "}
            <span className="text-luxury-cream">{order.customerName}</span>
          </p>
          <p>
            <span className="font-semibold text-luxury-gold">Email:</span>{" "}
            <span className="text-luxury-cream">{order.customerEmail}</span>
          </p>
          <p>
            <span className="font-semibold text-luxury-gold">Phone:</span>{" "}
            <span className="text-luxury-cream">{order.customerPhone || "N/A"}</span>
          </p>
          <p>
            <span className="font-semibold text-luxury-gold">Shipping Address:</span>{" "}
            <span className="text-luxury-cream">
              {order.shippingStreet}, {order.shippingCity}, {order.shippingState},{" "}
              {order.shippingPostalCode}, {order.shippingCountry}
            </span>
          </p>
          <p>
            <span className="font-semibold text-luxury-gold">Payment Method:</span>{" "}
            <span className="text-luxury-cream">{order.paymentMethod}</span>
          </p>

          {/* Status */}
          <div className="flex items-center gap-3 pt-1">
            <span className="font-semibold text-luxury-gold">Update Status:</span>
            <select
              value={status}
              onChange={handleStatusChange}
              className="px-3 py-1.5 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h2 className="font-logo text-lg font-semibold text-luxury-cream mb-3">
            Order Items
          </h2>
          <div className="space-y-3">
            {order.OrderItems?.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-center gap-3 p-3 border border-luxury-gold/10 rounded-lg bg-luxury-ink"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.Product.productImage}
                    alt={item.Product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-luxury-cream">{item.productName}</p>
                    <p className="text-luxury-cream/60 text-sm">
                      {item.quantity} x Rs. {item.priceAtPurchase}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-luxury-gold">
                    Subtotal: Rs. {item.subtotal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount & Created At */}
        <div className="mt-6">
          <p className="font-semibold text-lg text-luxury-cream">
            Total Amount: <span className="text-luxury-gold">Rs. {order.totalAmount}</span>
          </p>
          <p className="text-luxury-cream/60 text-sm mt-1">
            Order Created At: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Order Slip */}
      <div className="mt-6">
        <OrderSlip order={order} />
      </div>
    </div>
  );
};

export default OrderDetails;
