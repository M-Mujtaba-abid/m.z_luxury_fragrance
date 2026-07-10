
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { getUserProfile, updateUserProfile } from "../../redux/auth/AuthThunk";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const { user, profileLoading, profileError, updateSuccess } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    } else {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (updateSuccess) {
      navigate(isAdmin ? "/admin/profile" : "/web/profile", { replace: true });
    }
  }, [updateSuccess, navigate, isAdmin]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (profileImage) data.append("profileImage", profileImage);
    try {
      await dispatch(updateUserProfile(data)).unwrap();
    } catch (_) {}
  };

  return (
    <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Update Profile
        </h1>

        {profileError && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
            {profileError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
            rows={3}
            value={formData.address}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm mb-1 dark:text-gray-300">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded dark:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
