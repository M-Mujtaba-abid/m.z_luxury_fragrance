

import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  // console.log('AdminLayout rendering');
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-6 text-gray-900 dark:text-white transition-colors ml-0 md:ml-64">
   
        <Outlet /> {/* ✅ yahan child routes render honge */}
      </div>
    </div>
  );
};

export default AdminLayout;
