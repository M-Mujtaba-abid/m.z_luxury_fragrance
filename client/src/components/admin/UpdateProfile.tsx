
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { getUserProfile, updateUserProfile } from "../../redux/thunks/AuthThunk";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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
    <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-luxury-ink">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-luxury-card rounded-xl shadow-md border border-luxury-gold/10 p-6"
      >
        <h1 className="font-logo text-2xl md:text-3xl font-bold mb-6 text-luxury-cream">
          Update Profile
        </h1>

        {profileError && (
          <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-900/50 text-red-300">
            {profileError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            rows={3}
            value={formData.address}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm mb-1 text-luxury-cream/80">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-luxury-cream/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-luxury-gold file:text-luxury-ink file:font-medium file:cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={profileLoading}
              className="px-4 py-2 bg-luxury-gold text-luxury-ink rounded-lg font-medium hover:bg-luxury-gold-bright transition-colors duration-300 disabled:opacity-50"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </motion.button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-luxury-gold text-luxury-gold rounded-lg hover:bg-luxury-gold/10 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateProfile;
