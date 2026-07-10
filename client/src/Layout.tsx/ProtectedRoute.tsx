

// import { useSelector } from "react-redux";
// import type { RootState } from "../redux/store";
// import { Navigate, useLocation} from "react-router-dom";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   role?: "Admin";
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
//   // const navigate=useNavigate()
//   const { user, token } = useSelector((state: RootState) => state.user as any);
//   const location = useLocation();



//   // Only protect Admin routes
//   if (role === "Admin") {
//     if (!token || !user || user.userRole !== "Admin") {
//       return <Navigate to="/login" replace state={{ from: location }} />;
//     }
//   }

//   // If role is Admin and token exists & user is Admin, allow rendering
//   return <>{children}</>;
// };

// export default ProtectedRoute;



import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "Admin"; // ✅ role property wapas add ki (sirf admin check ke liye)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, token } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  // ✅ Sirf Admin routes ko protect karna hai
  if (role === "Admin") {
    if (!token || !user || user.userRole !== "Admin") {
      // Agar token missing ya user admin nahi hai to → /login bhejo
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  // ✅ Agar sab sahi hai to route allow karo
  return <>{children}</>;
};

export default ProtectedRoute;
