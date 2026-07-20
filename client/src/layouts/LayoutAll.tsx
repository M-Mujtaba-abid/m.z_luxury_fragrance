import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "../utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Toaster } from "react-hot-toast";

// Layouts (Statically imported to preserve main frame structure)
import AdminLayout from "./AdminLayout";
import WebSiteLayout from "./WebSiteLayout";

// --- Lazy Load Pages & Components (Code Splitting) ---

// Auth pages
const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const ForgetPassword = React.lazy(() => import("../pages/auth/ForgetPassword"));
const VerifyOtp = React.lazy(() => import("../pages/auth/VarifyOtp"));
const SetNewPassword = React.lazy(() => import("../pages/auth/SetNewPassword"));

// Admin pages
const Dashboard = React.lazy(() => import("../pages/admin/Dashboard"));
const PostProduct = React.lazy(() => import("../pages/admin/product/PostProduct"));
const ListProduct = React.lazy(() => import("../pages/admin/product/ListProduct"));
const ProductDetailPage = React.lazy(() => import("../pages/admin/product/ProductDetailPage"));
const OrderDirectory = React.lazy(() => import("../pages/admin/order/OrderDirectory"));
const OrderDetails = React.lazy(() => import("../pages/admin/order/Orderdetails"));
const ReviewDirectory = React.lazy(() => import("../pages/admin/review/ReviewDirectory"));
const ContactDirectory = React.lazy(() => import("../pages/admin/contact/ContactDirectory"));
const TestimonialDirectory = React.lazy(() => import("../pages/admin/testimonial/TestimonialDirectory"));
const Profile = React.lazy(() => import("../components/admin/Profile"));
const UpdateProfile = React.lazy(() => import("../components/admin/UpdateProfile"));

// Web/User pages
const Home = React.lazy(() => import("../user_side/pages/Home"));
const About = React.lazy(() => import("../pages/user/About"));
const ContactUs = React.lazy(() => import("../pages/user/ContactUs"));
const Products = React.lazy(() => import("../pages/user/Products"));
const UserProductDetailPage = React.lazy(() => import("../pages/user/ProductDetailPage"));
const Cart = React.lazy(() => import("../pages/user/cart/Cart"));
const CheckOut = React.lazy(() => import("../pages/user/cart/CheckOut"));
const AllProductsRender = React.lazy(() => import("../pages/user/AllProductsRender"));
const ThankYouContent = React.lazy(() => import("../pages/user/cart/ThankYouContent"));
const MyOrders = React.lazy(() => import("../pages/user/cart/MyOrders"));
const OrderTracking = React.lazy(() => import("../pages/user/OrderTracking"));
const SearchResults = React.lazy(() => import("../components/user/SearchResults"));
const Wishlist = React.lazy(() => import("../pages/user/Wishlist"));
const Compare = React.lazy(() => import("../pages/user/Compare"));
const Success = React.lazy(() => import("../pages/payment/Success"));
const Cancel = React.lazy(() => import("../pages/payment/Cancel"));

// Elegant minimalist route loader component
const PageLoader = () => (
  <div className="min-h-[60vh] w-full flex items-center justify-center bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-[2px] border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white rounded-full animate-spin" />
      <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-light">Loading Impression</span>
    </div>
  </div>
);

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
            <Route path="reviews" element={<ReviewDirectory />} />
            <Route path="contact-messages" element={<ContactDirectory />} />
            <Route path="testimonials" element={<TestimonialDirectory />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/update" element={<UpdateProfile />} />
          </Route>

          {/* ---------------------- Web/User Routes ---------------------- */}
          <Route path="/web" element={<WebSiteLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="compare" element={<Compare />} />
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
      </Suspense>
    </>
  );
};

export default LayoutAll;
