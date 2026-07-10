

import  React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UpdatePasswordModel from "./UpdatePasswordModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { getUserProfile } from "../../redux/auth/AuthThunk";
import { User, Mail, Phone, MapPin, Shield, Calendar, CheckCircle } from "lucide-react";

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
      <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <p className="text-gray-800 dark:text-gray-100 mb-4 font-medium">
            Please login first to see your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }


  if (profileError) {
    return (
      <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Error</p>
          <p>{profileError}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md">
          <p>No user data found. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
                <div className="relative inline-block">
                  <img
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover mx-auto"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <h2 className="text-xl font-bold text-white mt-4">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="inline-flex items-center bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full mt-2">
                  <Shield className="w-4 h-4 text-white mr-1" />
                  <span className="text-sm text-white capitalize">
                    {user.userRole}
                  </span>
                </div>
              </div>

              {/* Profile Status */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
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
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      First Name
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">
                        {user.firstName}
                      </span>
                    </div>
                  </div>
                  {/* last name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Last Name
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">
                        {user.lastName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">
                      {user.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Address
                  </label>
                  <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <span className="text-gray-900 dark:text-white">
                      {user.address || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      User ID
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white font-mono">
                        #{user.id}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Account Type
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {user.userRole}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last updated: {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate(isAdmin ? "/admin/profile/update" : "/web/profile/update")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
              >
                Edit Profile
              </button>
              <button onClick={() => setPasswordModalOpen(true)} className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-600 hover:text-white dark:hover:bg-gray-700 py-3 px-4 rounded-lg font-medium transition duration-200">
                Change Password
              </button>
            </div>
          </div>
          <UpdatePasswordModel open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Profile;