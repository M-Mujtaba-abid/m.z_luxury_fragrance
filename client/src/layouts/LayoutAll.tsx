
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "../utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

// Layouts
import AdminLayout from "./AdminLayout";
import WebSiteLayout from "./WebSiteLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import PostProduct from "../pages/admin/product/PostProduct";
import ListProduct from "../pages/admin/product/ListProduct";
import ProductDetailPage from "../pages/admin/product/ProductDetailPage";
import OrderDirectory from "../pages/admin/order/OrderDirectory";
import OrderDetails from "../pages/admin/order/Orderdetails";

// Web/User pages
import Home from "../pages/user/Home";
import About from "../pages/user/About";
import ContactUs from "../pages/user/ContactUs";
import Products from "../pages/user/Products";
import UserProductDetailPage from "../pages/user/ProductDetailPage";
import Cart from "../pages/user/cart/Cart";
import CheckOut from "../pages/user/cart/CheckOut";
import AllProductsRender from "../pages/user/AllProductsRender";
import ThankYouContent from "../pages/user/cart/ThankYouContent";
import MyOrders from "../pages/user/cart/MyOrders";
import OrderTracking from "../pages/user/OrderTracking";
import SearchResults from "../components/user/SearchResults";
import Success from "../pages/payment/Success";
import Cancel from "../pages/payment/Cancel";

import { Toaster } from "react-hot-toast";
import Profile from "../components/admin/Profile";
import ForgetPassword from "../pages/auth/ForgetPassword";
import VerifyOtp from "../pages/auth/VarifyOtp";
import SetNewPassword from "../pages/auth/SetNewPassword";
import UpdateProfile from "../components/admin/UpdateProfile";

const LayoutAll = () => {
  const { user, token } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  return (
    <>
      <Toaster position="top-right" />
      <ScrollToTop />
      <Routes>
        {/* ---------------------- Auth/Public Routes ---------------------- */}
        {/* ✅ Public pages → hamesha allow hone chahiye */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        {/* ---------------------- Admin Routes ---------------------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="product" element={<PostProduct />} />
          <Route path="product/:productId" element={<PostProduct />} />
          <Route path="products" element={<ListProduct />} />
          <Route
            path="product-detail/:productId"
            element={<ProductDetailPage />} 
          />
          <Route path="orders" element={<OrderDirectory />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          {/* Admin profile routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="profile/update" element={<UpdateProfile />} />
        </Route>

        {/* ---------------------- Web/User Routes ---------------------- */}
        <Route path="/web" element={<WebSiteLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path=":category" element={<Products />} />
          <Route
            path="product-detail/:productId"
            element={<UserProductDetailPage />}
          />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="all-products" element={<AllProductsRender />} />
          <Route path="thankyou" element={<ThankYouContent />} />
          <Route path="myorders" element={<MyOrders />} />
          <Route path="track-order" element={<OrderTracking />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="success" element={<Success />} />
          <Route path="cancel" element={<Cancel />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/update" element={<UpdateProfile />} />
        </Route>

        {/* ---------------------- Default Redirects ---------------------- */}
        <Route path="/" element={<Navigate to="/web" replace />} />

        {/* ✅ Only redirect truly unknown paths, not existing routes */}
        <Route
          path="*"
          element={
            token ? (
              user?.userRole === "Admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/web" replace />
              )
            ) : (
              <Navigate to="/login" replace state={{ from: location }} />
            )
          }
        />
      </Routes>
    </>
  );
};

export default LayoutAll;
