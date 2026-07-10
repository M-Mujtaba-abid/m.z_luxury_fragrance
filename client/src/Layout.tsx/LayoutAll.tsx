
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "../utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

// Layouts
import AdminLayout from "../admin_side/shared/AdminLoyout";
import WebSiteLayout from "../user_side/webLayout/WebSiteLayout";

// Auth pages
import Login from "../auth/Login";
import Register from "../auth/Register";

// Admin pages
import Dashboard from "../admin_side/shared/Dashboard";
import PostProduct from "../admin_side/pages/product/PostProduct";
import ListProduct from "../admin_side/pages/product/ListProduct";
import ProductDetailPage from "../admin_side/pages/product/ProductDetailPage";
import OrderDirectory from "../admin_side/pages/order/OrderDirectory";
import OrderDetails from "../admin_side/pages/order/Orderdetails";

// Web/User pages
import Home from "../user_side/pages/Home";
import About from "../user_side/pages/About";
import ContactUs from "../user_side/pages/ContactUs";
import Products from "../user_side/pages/Products";
import UserProductDetailPage from "../user_side/pages/ProductDetailPage";
import Cart from "../user_side/pages/cart/Cart";
import CheckOut from "../user_side/pages/cart/CheckOut";
import AllProductsRender from "../user_side/pages/AllProductsRender";
import ThankYouContent from "../user_side/pages/cart/ThankYouContent";
import MyOrders from "../user_side/pages/cart/oder/MyOrders";
import SearchResults from "../user_side/component/SearchResults";
import Success from "../payment/Success";
import Cancel from "../payment/Cancel";

import { Toaster } from "react-hot-toast";
import Profile from "../admin_side/component/Profile";
import ForgetPassword from "../auth/ForgetPassword";
import VerifyOtp from "../auth/VarifyOtp";
import SetNewPassword from "../auth/SetNewPassword";
import UpdateProfile from "../admin_side/component/UpdateProfile";

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
