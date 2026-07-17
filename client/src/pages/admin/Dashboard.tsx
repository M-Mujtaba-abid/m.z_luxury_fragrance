import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalProductsCount, fetchProducts } from "../../redux/thunks/ProductThunk";
import { fetchAllOrders, fetchTotalOrders } from "../../redux/thunks/OrderThunk";
import { fetchTotalUsers, logoutUser } from "../../redux/thunks/AuthThunk";
import type { RootState, AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LOW_STOCK_THRESHOLD = 5;
const DAYS_IN_TREND_WINDOW = 7;
const DAYS_IN_CHART = 30;

const formatCurrency = (value: number) => `Rs. ${Math.round(value).toLocaleString()}`;

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { totalProductsCount, products } = useSelector((state: RootState) => state.products);
  const { orders, totalOrders } = useSelector((state: RootState) => state.order);
  const { totalUsers, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getTotalProductsCount());
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchTotalOrders());
    dispatch(fetchTotalUsers());
  }, [dispatch]);

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // ---- Derived data (all computed client-side from existing order/product data) ----

  const validOrders = useMemo(
    () => (orders || []).filter((o: any) => o.status !== "cancelled"),
    [orders]
  );

  const totalRevenue = useMemo(
    () => validOrders.reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0),
    [validOrders]
  );

  // Week-over-week trend for revenue and order count
  const { revenueTrend, ordersTrend } = useMemo(() => {
    const now = Date.now();
    const weekMs = DAYS_IN_TREND_WINDOW * 24 * 60 * 60 * 1000;
    const thisWeekStart = now - weekMs;
    const prevWeekStart = now - weekMs * 2;

    let thisWeekRevenue = 0;
    let prevWeekRevenue = 0;
    let thisWeekOrders = 0;
    let prevWeekOrders = 0;

    validOrders.forEach((o: any) => {
      const created = new Date(o.createdAt).getTime();
      const amount = Number(o.totalAmount || 0);
      if (created >= thisWeekStart) {
        thisWeekRevenue += amount;
        thisWeekOrders += 1;
      } else if (created >= prevWeekStart) {
        prevWeekRevenue += amount;
        prevWeekOrders += 1;
      }
    });

    const pctChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      revenueTrend: pctChange(thisWeekRevenue, prevWeekRevenue),
      ordersTrend: pctChange(thisWeekOrders, prevWeekOrders),
    };
  }, [validOrders]);

  // Daily revenue for the last 30 days
  const salesOverTime = useMemo(() => {
    const days: { date: string; revenue: number }[] = [];
    const dayMs = 24 * 60 * 60 * 1000;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = DAYS_IN_CHART - 1; i >= 0; i--) {
      const day = new Date(now.getTime() - i * dayMs);
      days.push({
        date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: 0,
      });
    }

    validOrders.forEach((o: any) => {
      const created = new Date(o.createdAt);
      created.setHours(0, 0, 0, 0);
      const diffDays = Math.round((now.getTime() - created.getTime()) / dayMs);
      if (diffDays >= 0 && diffDays < DAYS_IN_CHART) {
        days[DAYS_IN_CHART - 1 - diffDays].revenue += Number(o.totalAmount || 0);
      }
    });

    return days;
  }, [validOrders]);

  // Top-selling perfumes by units sold
  const topSelling = useMemo(() => {
    const tally = new Map<number, { title: string; image: string; quantity: number }>();

    validOrders.forEach((o: any) => {
      (o.OrderItems || []).forEach((item: any) => {
        const productId = item.productId;
        const existing = tally.get(productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          tally.set(productId, {
            title: item.Product?.title || item.productName || "Unknown",
            image: item.Product?.productImage || "",
            quantity: item.quantity,
          });
        }
      });
    });

    return Array.from(tally.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [validOrders]);

  const lowStockProducts = useMemo(
    () =>
      (products || [])
        .filter((p: any) => p.stock <= LOW_STOCK_THRESHOLD)
        .sort((a: any, b: any) => a.stock - b.stock),
    [products]
  );

  const kpiCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      trend: revenueTrend,
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: (totalOrders ?? validOrders.length).toLocaleString(),
      trend: ordersTrend,
      icon: ShoppingBag,
    },
    {
      label: "Total Products",
      value: (totalProductsCount ?? 0).toLocaleString(),
      icon: Package,
    },
    {
      label: "Total Customers",
      value: (totalUsers ?? 0).toLocaleString(),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center relative">
        <div>
          <h1 className="font-logo text-3xl font-bold text-luxury-cream ml-10 md:ml-0">
            Dashboard
          </h1>
          <p className="text-sm text-luxury-cream/60">Welcome back — here's how the boutique is doing.</p>
        </div>

        {/* Account dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-luxury-gold/20 bg-luxury-card text-luxury-cream hover:border-luxury-gold/40 transition-colors duration-300"
          >
            Account
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-luxury-gold/10 bg-luxury-elevated shadow-lg z-50">
              <ul className="py-1 text-sm">
                <li>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/admin/profile");
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-luxury-gold/10 text-luxury-cream/80 hover:text-luxury-cream transition-colors duration-300"
                  >
                    My Profile
                  </button>
                </li>
                <li>
                  <hr className="my-1 border-luxury-gold/10" />
                </li>
                <li>
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      if (token) {
                        try {
                          await dispatch(logoutUser()).unwrap();
                        } catch {}
                        navigate("/login");
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-950/30 text-red-400 transition-colors duration-300"
                  >
                    {token ? "Logout" : "Login"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const hasTrend = typeof card.trend === "number";
          const trendPositive = (card.trend ?? 0) >= 0;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-luxury-card border border-luxury-gold/10 rounded-xl p-6 shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-luxury-gold" />
                </div>
                {hasTrend && (
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      trendPositive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {trendPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(card.trend ?? 0).toFixed(0)}%
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-luxury-cream/60">{card.label}</p>
              <p className="font-logo text-2xl font-bold text-luxury-cream mt-1">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Sales over time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-luxury-card border border-luxury-gold/10 rounded-xl p-6 shadow-md"
      >
        <h2 className="font-logo text-lg font-semibold text-luxury-cream mb-4">
          Sales Over Time <span className="text-sm font-sans text-luxury-cream/50">(last 30 days)</span>
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesOverTime}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a24b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c9a24b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#c9a24b" strokeOpacity={0.1} />
            <XAxis
              dataKey="date"
              stroke="#f5f0e6"
              opacity={0.5}
              fontSize={12}
              interval={Math.ceil(DAYS_IN_CHART / 8)}
            />
            <YAxis stroke="#f5f0e6" opacity={0.5} fontSize={12} tickFormatter={(v) => `${v}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#242430",
                border: "1px solid rgba(201,162,75,0.2)",
                borderRadius: "8px",
                color: "#f5f0e6",
              }}
              formatter={(value: number) => [formatCurrency(value), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#c9a24b"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top-selling + Low-stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-luxury-card border border-luxury-gold/10 rounded-xl p-6 shadow-md"
        >
          <h2 className="font-logo text-lg font-semibold text-luxury-cream mb-4">
            Top-Selling Perfumes
          </h2>
          {topSelling.length === 0 ? (
            <p className="text-sm text-luxury-cream/50">No sales data yet.</p>
          ) : (
            <ul className="space-y-3">
              {topSelling.map((item, index) => (
                <li key={item.title + index} className="flex items-center gap-4">
                  <span className="w-5 text-sm font-semibold text-luxury-gold/60">
                    {index + 1}
                  </span>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg border border-luxury-gold/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-luxury-cream text-sm font-medium truncate">{item.title}</p>
                  </div>
                  <span className="text-sm font-semibold text-luxury-gold whitespace-nowrap">
                    {item.quantity} sold
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-luxury-card border border-luxury-gold/10 rounded-xl p-6 shadow-md"
        >
          <h2 className="font-logo text-lg font-semibold text-luxury-cream mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Low Stock Alert
            <span className="text-sm font-sans text-luxury-cream/50">(≤ {LOW_STOCK_THRESHOLD} units)</span>
          </h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-luxury-cream/50">All products are well stocked.</p>
          ) : (
            <ul className="space-y-3">
              {lowStockProducts.map((p: any) => (
                <li key={p.id} className="flex items-center gap-4">
                  <img
                    src={p.productImage}
                    alt={p.title}
                    className="w-12 h-12 object-cover rounded-lg border border-luxury-gold/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-luxury-cream text-sm font-medium truncate">{p.title}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                      p.stock === 0
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30"
                    }`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
