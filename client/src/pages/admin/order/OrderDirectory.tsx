import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { fetchAllOrders } from "../../../redux/thunks/OrderThunk";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Same status color language used on the customer-facing Order Tracking page.
const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  confirmed: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  shipped: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  delivered: "bg-green-500/15 text-green-300 border border-green-500/30",
  cancelled: "bg-red-500/15 text-red-300 border border-red-500/30",
};

const OrderDirectory: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { orders } = useSelector((state: RootState) => state.order);
  const { loading } = useSelector((state: RootState) => state.loader);

  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleViewDetails = (id: number) => {
    navigate(`/admin/orders/${id}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const filteredOrders =
    filterStatus === "all" ? orders : orders.filter((order: any) => order.status === filterStatus);

  return (
    <div className="min-h-screen bg-luxury-ink">
      <div className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md p-6">
        <h1 className="font-logo text-3xl font-bold text-luxury-cream mb-6">All Orders</h1>

        {/* Status Filter */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm font-medium text-luxury-cream/70">Filter by Status:</span>
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <p className="text-luxury-cream/50 text-center py-10">No orders found.</p>
        )}

        {!loading && filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-x-auto rounded-lg border border-luxury-gold/10"
          >
            <table className="min-w-full">
              <thead className="bg-luxury-elevated">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden md:table-cell">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden md:table-cell">
                    Total Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-gold/10">
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="bg-luxury-card hover:bg-luxury-gold/5 transition-colors duration-300">
                    <td className="px-4 py-3 text-luxury-cream font-medium">#{order.id}</td>
                    <td className="px-4 py-3 text-luxury-cream/80 hidden md:table-cell">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/60 hidden md:table-cell">
                      {order.customerEmail}
                    </td>
                    <td className="px-4 py-3 text-luxury-cream/80 hidden md:table-cell">
                      {order.OrderItems?.length || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide capitalize ${
                          statusStyles[order.status] || "bg-luxury-gold/10 text-luxury-cream/60 border border-luxury-gold/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="bg-luxury-gold text-luxury-ink px-3 py-1.5 rounded-md text-sm font-medium hover:bg-luxury-gold-bright transition-colors duration-300"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderDirectory;
