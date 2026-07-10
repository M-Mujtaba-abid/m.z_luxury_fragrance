
// // src/pages/Admin/Dashboard.tsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getTotalProductsCount } from "../../redux/Admin/AdminThunk/ProductThunk";
// import { fetchTotalOrders } from "../../redux/Admin/AdminThunk/OrderThunk";
// import { fetchTotalUsers } from "../../redux/auth/AuthThunk";
// import type { RootState, AppDispatch } from "../../redux/store";
// import { logoutUser } from "../../redux/auth/AuthThunk";
// import { useNavigate } from "react-router-dom";

// // Recharts Imports
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// const Dashboard = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const { totalProductsCount } = useSelector((state: RootState) => state.products);
//   const { totalOrders } = useSelector((state: RootState) => state.order);
//   const { totalUsers, token } = useSelector((state: RootState) => state.user);

//   useEffect(() => {
//     dispatch(getTotalProductsCount());
//     dispatch(fetchTotalOrders());
//     dispatch(fetchTotalUsers());
//   }, [dispatch]);

//   // 🔹 Chart Data
//   const statsData = [
//     { name: "Users", value: totalUsers },
//     { name: "Products", value: totalProductsCount },
//     { name: "Orders", value: totalOrders },
//   ];

//   const COLORS = ["#4f46e5", "#22c55e", "#facc15"];

//   return (
//     <div className="space-y-6 p-5">
//       {/* Header */}
//       <div className="flex justify-between items-center relative">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800 ml-10 md:ml-0 dark:text-white">
//             Dashboard
//           </h1>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Welcome to dashboard
//           </p>
//         </div>
//         {/* Right corner minimal dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setMenuOpen((s) => !s)}
//             className="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
//           >
//             Account
//             <svg className={`w-4 h-4 transition ${menuOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
//           </button>
//           {menuOpen && (
//             <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-lg dark:border-gray-700/70 dark:bg-gray-800 z-50">
//               <ul className="py-1 text-sm">
//                 <li>
//                   <button
//                     onClick={() => { setMenuOpen(false); navigate("/admin/profile"); }}
//                     className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200"
//                   >
//                     My Profile
//                   </button>
//                 </li>
//                 <li><hr className="my-1 border-gray-200 dark:border-gray-700" /></li>
//                 <li>
//                   <button
//                     onClick={async () => {
//                       setMenuOpen(false);
//                       if (token) {
//                         try { await dispatch(logoutUser()).unwrap(); } catch {}
//                         navigate("/login");
//                       } else {
//                         navigate("/login");
//                       }
//                     }}
//                     className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-red-600 dark:text-red-400"
//                   >
//                     {token ? "Logout" : "Login"}
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* ✅ Total Users */}
//         <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
//           <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalUsers}</p>
//         </div>

//         {/* Total Products */}
//         <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
//           <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalProductsCount}</p>
//         </div>

//         {/* Total Orders */}
//         <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
//           <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalOrders}</p>
//         </div>

//         {/* Revenue */}
//         <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
//           <p className="text-2xl font-semibold text-gray-900 dark:text-white">$12,345</p>
//         </div>
//       </div>

//       {/* 🔹 Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
//         {/* Bar Chart */}
//         <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stats Overview</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={statsData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#4f46e5" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Distribution</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={statsData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 fill="#8884d8"
//                 label
//               >
//                 {statsData.map((_, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// src/pages/Admin/Dashboard.tsx
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalProductsCount } from "../../redux/Admin/AdminThunk/ProductThunk";
import { fetchTotalOrders } from "../../redux/Admin/AdminThunk/OrderThunk";
import { fetchTotalUsers, logoutUser } from "../../redux/auth/AuthThunk";
import type { RootState, AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";

// Recharts Imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // 👈 Ref for dropdown

  const { totalProductsCount } = useSelector((state: RootState) => state.products);
  const { totalOrders } = useSelector((state: RootState) => state.order);
  const { totalUsers, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getTotalProductsCount());
    dispatch(fetchTotalOrders());
    dispatch(fetchTotalUsers());
  }, [dispatch]);

  // 👇 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // 🔹 Chart Data
  const statsData = [
    { name: "Users", value: totalUsers },
    { name: "Products", value: totalProductsCount },
    { name: "Orders", value: totalOrders },
  ];

  const COLORS = ["#4f46e5", "#22c55e", "#facc15"];

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex justify-between items-center relative">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 ml-10 md:ml-0 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome to dashboard
          </p>
        </div>

        {/* Right corner minimal dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Account
            <svg
              className={`w-4 h-4 transition ${menuOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-lg dark:border-gray-700/70 dark:bg-gray-800 z-50">
              <ul className="py-1 text-sm">
                <li>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/admin/profile");
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200"
                  >
                    My Profile
                  </button>
                </li>
                <li>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
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
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-red-600 dark:text-red-400"
                  >
                    {token ? "Logout" : "Login"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ✅ Total Users */}
        <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalUsers}</p>
        </div>

        {/* Total Products */}
        <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalProductsCount}</p>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalOrders}</p>
        </div>

        {/* Revenue */}
        <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-colors">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">$12,345</p>
        </div>
      </div>

      {/* 🔹 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stats Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {statsData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
