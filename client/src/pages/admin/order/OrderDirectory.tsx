import React, { useState } from "react";
import { useAllOrdersQuery } from "../../../queries/orderQueries";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  confirmed: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  shipped: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  delivered: "bg-green-500/15 text-green-300 border border-green-500/30",
  cancelled: "bg-red-500/15 text-red-300 border border-red-500/30",
};

const STATUS_OPTIONS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const OrderDirectory: React.FC = () => {
  const navigate = useNavigate();
  const { data: orders = [], isLoading: loading } = useAllOrdersQuery();
  const [filterStatus, setFilterStatus] = useState("all");

  const handleViewDetails = (id: number) => {
    navigate(`/admin/orders/${id}`);
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order: any) => order.status === filterStatus);

  return (
    <div className="min-h-screen bg-luxury-ink">
      <div className="bg-luxury-card border border-luxury-gold/10 rounded-xl shadow-md p-4 sm:p-6">
        {/* Page header */}
        <h1 className="font-logo text-2xl sm:text-3xl font-bold text-luxury-cream mb-5 pl-14 md:pl-0">
          All Orders
        </h1>

        {/* Status Filter */}
        <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-sm font-medium text-luxury-cream/70 whitespace-nowrap">
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-2.5 min-h-[44px] rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold/60 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredOrders.length === 0 && (
          <p className="text-luxury-cream/50 text-center py-10">No orders found.</p>
        )}

        {!loading && filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ─── MOBILE: Card view (hidden on sm+) ─── */}
            <div className="sm:hidden space-y-3">
              {filteredOrders.map((order: any, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                  className="bg-luxury-ink border border-luxury-gold/10 rounded-xl p-4 hover:border-luxury-gold/25 transition-colors duration-200"
                >
                  {/* Card header: order id + status badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-luxury-cream font-semibold text-base">
                        Order <span className="text-luxury-gold">#{order.id}</span>
                      </p>
                      <p className="text-luxury-cream/50 text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize whitespace-nowrap ${
                        statusStyles[order.status] ||
                        "bg-luxury-gold/10 text-luxury-cream/60 border border-luxury-gold/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="space-y-1 mb-3">
                    <p className="text-sm text-luxury-cream/80 truncate">
                      <span className="text-luxury-cream/50 text-xs uppercase tracking-wide mr-1">
                        Customer
                      </span>
                      {order.customerName}
                    </p>
                    <p className="text-xs text-luxury-cream/50 truncate">{order.customerEmail}</p>
                  </div>

                  {/* Footer: items count + CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-luxury-gold/10">
                    <span className="text-xs text-luxury-cream/50">
                      {order.OrderItems?.length || 0}{" "}
                      {order.OrderItems?.length === 1 ? "item" : "items"}
                    </span>
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="flex items-center gap-1 bg-luxury-gold text-luxury-ink px-3 py-2 min-h-[40px] rounded-lg text-sm font-semibold hover:bg-luxury-gold-bright active:scale-95 transition-all duration-200"
                    >
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ─── TABLET / DESKTOP: Table view (hidden below sm) ─── */}
            <div className="hidden sm:block overflow-x-auto rounded-lg border border-luxury-gold/10">
              <table className="min-w-full">
                <thead className="bg-luxury-elevated">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-luxury-cream/60 hidden md:table-cell">
                      Items
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
                    <tr
                      key={order.id}
                      className="bg-luxury-card hover:bg-luxury-gold/5 transition-colors duration-300"
                    >
                      <td className="px-4 py-3 text-luxury-cream font-medium">#{order.id}</td>
                      <td className="px-4 py-3 text-luxury-cream/80">{order.customerName}</td>
                      <td className="px-4 py-3 text-luxury-cream/60 hidden md:table-cell">
                        {order.customerEmail}
                      </td>
                      <td className="px-4 py-3 text-luxury-cream/80 hidden md:table-cell">
                        {order.OrderItems?.length || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide capitalize ${
                            statusStyles[order.status] ||
                            "bg-luxury-gold/10 text-luxury-cream/60 border border-luxury-gold/20"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="bg-luxury-gold text-luxury-ink px-3 py-2 min-h-[40px] rounded-md text-sm font-medium hover:bg-luxury-gold-bright transition-colors duration-300"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderDirectory;
