

import  React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UpdatePasswordModel from "./UpdatePasswordModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { getUserProfile } from "../../redux/thunks/AuthThunk";
import { User, Mail, Phone, MapPin, Shield, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);
  const { user,  profileError, token } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (token) {
      dispatch(getUserProfile());
    }
  }, [dispatch, token]);

  if (!token) {
    return (
      <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-luxury-ink flex items-center justify-center">
        <div className="bg-luxury-card border border-luxury-gold/10 p-6 rounded-xl shadow-md text-center">
          <p className="text-luxury-cream mb-4 font-medium">
            Please login first to see your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded bg-luxury-gold text-luxury-ink font-medium hover:bg-luxury-gold-bright transition-colors duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }


  if (profileError) {
    return (
      <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-luxury-ink flex items-center justify-center">
        <div className="bg-red-950/40 border border-red-900/50 text-red-300 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Error</p>
          <p>{profileError}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-luxury-ink flex items-center justify-center">
        <div className="bg-yellow-950/30 border border-yellow-800/40 text-yellow-300 px-4 py-3 rounded max-w-md">
          <p>No user data found. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-luxury-ink">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-logo text-3xl md:text-4xl font-bold mb-8 text-luxury-cream">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-luxury-card rounded-xl shadow-md overflow-hidden border border-luxury-gold/10">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-luxury-elevated to-luxury-card p-6 text-center">
                <div className="relative inline-block">
                  <img
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-24 h-24 rounded-full border-4 border-luxury-gold/40 object-cover mx-auto"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-luxury-card"></div>
                </div>
                <h2 className="font-logo text-xl font-bold text-luxury-cream mt-4">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="inline-flex items-center bg-luxury-gold/15 border border-luxury-gold/30 px-3 py-1 rounded-full mt-2">
                  <Shield className="w-4 h-4 text-luxury-gold mr-1" />
                  <span className="text-sm text-luxury-gold capitalize">
                    {user.userRole}
                  </span>
                </div>
              </div>

              {/* Profile Status */}
              <div className="p-4 border-b border-luxury-gold/10">
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-sm font-medium text-luxury-cream/80 capitalize">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="p-4 border-b border-luxury-gold/10">
                <div className="flex items-center justify-center text-sm text-luxury-cream/60">
                  <Calendar className="w-4 h-4 mr-2 text-luxury-gold/60" />
                  <span>
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              {/* <div className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {user.userRole === "Admin" ? "∞" : "0"}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Orders
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {user.userRole === "Admin" ? "∞" : "0"}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Completed
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-luxury-card rounded-xl shadow-md border border-luxury-gold/10 p-6">
              <h3 className="font-logo text-xl font-semibold text-luxury-cream mb-6">
                Personal Information
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-luxury-cream/60 mb-1">
                      First Name
                    </label>
                    <div className="flex items-center p-3 bg-luxury-ink border border-luxury-gold/10 rounded-lg">
                      <User className="w-5 h-5 text-luxury-gold/60 mr-3" />
                      <span className="text-luxury-cream">
                        {user.firstName}
                      </span>
                    </div>
                  </div>
                  {/* last name */}
                  <div>
                    <label className="block text-sm font-medium text-luxury-cream/60 mb-1">
                      Last Name
                    </label>
                    <div className="flex items-center p-3 bg-luxury-ink border border-luxury-gold/10 rounded-lg">
                      <User className="w-5 h-5 text-luxury-gold/60 mr-3" />
                      <span className="text-luxury-cream">
                        {user.lastName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-luxury-cream/60 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center p-3 bg-luxury-ink border border-luxury-gold/10 rounded-lg">
                    <Mail className="w-5 h-5 text-luxury-gold/60 mr-3" />
                    <span className="text-luxury-cream">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-luxury-cream/60 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center p-3 bg-luxury-ink border border-luxury-gold/10 rounded-lg">
                    <Phone className="w-5 h-5 text-luxury-gold/60 mr-3" />
                    <span className="text-luxury-cream">
                      {user.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-luxury-cream/60 mb-1">
                    Address
                  </label>
                  <div className="flex items-start p-3 bg-luxury-ink border border-luxury-gold/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-luxury-gold/60 mr-3 mt-0.5" />
                    <span className="text-luxury-cream">
                      {user.address || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-luxury-gold/10">
                  <div>
                    <label className="block text-sm font-medium text-luxury-cream/60 mb-1">
                      User ID
                    </label>
                    <div className="p-3 bg-luxury-ink border border-luxury-gold/10 rounded-lg">
                      <span className="text-sm text-luxury-cream font-mono">
                        #{user.id}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luxury-cream/60 mb-1">
                      Account Type
                    </label>
                    <div className="p-3 bg-luxury-ink border border-luxury-gold/10 rounded-lg">
                      <span className="text-sm text-luxury-cream capitalize">
                        {user.userRole}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="pt-4 border-t border-luxury-gold/10">
                  <p className="text-sm text-luxury-cream/50">
                    Last updated: {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate(isAdmin ? "/admin/profile/update" : "/profile/update")}
                className="w-full bg-luxury-gold text-luxury-ink py-3 px-4 rounded-lg font-medium hover:bg-luxury-gold-bright transition-colors duration-300"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="w-full border border-luxury-gold text-luxury-gold py-3 px-4 rounded-lg font-medium hover:bg-luxury-gold/10 transition-colors duration-300"
              >
                Change Password
              </button>
            </div>
          </motion.div>
          <UpdatePasswordModel open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Profile;