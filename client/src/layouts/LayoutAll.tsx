import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "../utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Toaster } from "react-hot-toast";

<<<<<<< HEAD:client/src/Layout.tsx/LayoutAll.tsx
// Layouts (Statically imported to preserve main frame structure)
import AdminLayout from "../admin_side/shared/AdminLoyout";
import WebSiteLayout from "../user_side/webLayout/WebSiteLayout";
=======
// Layouts
import AdminLayout from "./AdminLayout";
import WebSiteLayout from "./WebSiteLayout";
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/layouts/LayoutAll.tsx

// --- Lazy Load Pages & Components (Code Splitting) ---

// Auth pages
<<<<<<< HEAD:client/src/Layout.tsx/LayoutAll.tsx
const Login = React.lazy(() => import("../auth/Login"));
const Register = React.lazy(() => import("../auth/Register"));
const ForgetPassword = React.lazy(() => import("../auth/ForgetPassword"));
const VerifyOtp = React.lazy(() => import("../auth/VarifyOtp"));
const SetNewPassword = React.lazy(() => import("../auth/SetNewPassword"));

// Admin pages
const Dashboard = React.lazy(() => import("../admin_side/shared/Dashboard"));
const PostProduct = React.lazy(() => import("../admin_side/pages/product/PostProduct"));
const ListProduct = React.lazy(() => import("../admin_side/pages/product/ListProduct"));
const ProductDetailPage = React.lazy(() => import("../admin_side/pages/product/ProductDetailPage"));
const OrderDirectory = React.lazy(() => import("../admin_side/pages/order/OrderDirectory"));
const OrderDetails = React.lazy(() => import("../admin_side/pages/order/Orderdetails"));
const Profile = React.lazy(() => import("../admin_side/component/Profile"));
const UpdateProfile = React.lazy(() => import("../admin_side/component/UpdateProfile"));

// Web/User pages
const Home = React.lazy(() => import("../user_side/pages/Home"));
const About = React.lazy(() => import("../user_side/pages/About"));
const ContactUs = React.lazy(() => import("../user_side/pages/ContactUs"));
const Products = React.lazy(() => import("../user_side/pages/Products"));
const UserProductDetailPage = React.lazy(() => import("../user_side/pages/ProductDetailPage"));
const Cart = React.lazy(() => import("../user_side/pages/cart/Cart"));
const CheckOut = React.lazy(() => import("../user_side/pages/cart/CheckOut"));
const AllProductsRender = React.lazy(() => import("../user_side/pages/AllProductsRender"));
const ThankYouContent = React.lazy(() => import("../user_side/pages/cart/ThankYouContent"));
const MyOrders = React.lazy(() => import("../user_side/pages/cart/oder/MyOrders"));
const SearchResults = React.lazy(() => import("../user_side/component/SearchResults"));
const Success = React.lazy(() => import("../payment/Success"));
const Cancel = React.lazy(() => import("../payment/Cancel"));

// Elegant minimalist route loader component
const PageLoader = () => (
  <div className="min-h-[60vh] w-full flex items-center justify-center bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-[2px] border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin" />
      <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-light">Loading Impression</span>
    </div>
  </div>
);
=======
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
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/layouts/LayoutAll.tsx

const LayoutAll = () => {
  const { user, token } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  return (
    <>
      <Toaster position="top-right" />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ---------------------- Auth/Public Routes ---------------------- */}
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

          <Route
<<<<<<< HEAD:client/src/Layout.tsx/LayoutAll.tsx
            path="*"
            element={
              token ? (
                user?.userRole === "Admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/web" replace />
                )
=======
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
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44:client/src/layouts/LayoutAll.tsx
              ) : (
                <Navigate to="/login" replace state={{ from: location }} />
              )
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default LayoutAll;
