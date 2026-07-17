

import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  // console.log('AdminLayout rendering');
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 bg-luxury-ink p-6 text-luxury-cream ml-0 md:ml-64">
   
        <Outlet /> {/* ✅ yahan child routes render honge */}
      </div>
    </div>
  );
};

export default AdminLayout;
