

import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  // console.log('AdminLayout rendering');
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      {/* pt-16 md:pt-6 — hamburger button (fixed top-4 left-4) ke liye mobile pe top clearance */}
      <div className="flex-1 bg-luxury-ink p-3 sm:p-4 md:p-6 pt-16 md:pt-6 text-luxury-cream ml-0 md:ml-64 min-w-0">
        <Outlet /> {/* ✅ yahan child routes render honge */}
      </div>
    </div>
  );
};

export default AdminLayout;
