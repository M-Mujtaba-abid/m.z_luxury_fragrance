import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, registerLoading, registerError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    userRole: "User",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (profileImage) data.append("profileImage", profileImage);

    try {
      await register(data);
      setSuccess("Registration successful! Redirecting to login...");
      navigate("/login", { replace: true, state: { from: "register" } });
    } catch {
      // error shown via registerError
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-luxury-ink px-4 py-12 overflow-hidden">
      {/* Ambient gold radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-luxury-gold/20 blur-[120px] -translate-y-1/4"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="relative bg-luxury-card/80 backdrop-blur-xl border border-luxury-gold/20 shadow-[0_0_60px_-15px_rgba(201,162,75,0.35)] p-8 rounded-2xl w-full max-w-[600px] space-y-6"
      >
        <h1 className="font-logo text-4xl font-bold text-center text-luxury-cream">
          Sign Up
        </h1>

        {/* Messages */}
        {registerError && <p className="text-red-400 text-center font-medium">{registerError}</p>}
        {success && <p className="text-green-400 text-center font-medium">{success}</p>}

        {/* Grid for Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="firstName" placeholder="First Name"
            className="w-full px-3 py-3 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={formData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name"
            className="w-full px-3 py-3 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={formData.lastName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email"
            className="w-full px-3 py-3 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={formData.email} onChange={handleChange} required />
          <div className="relative w-full">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password"
              className="w-full px-3 py-3 pr-10 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
              value={formData.password} onChange={handleChange} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-luxury-cream/60 hover:text-luxury-gold-bright transition-colors duration-300">
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          <input type="text" name="phoneNumber" placeholder="Phone Number"
            className="w-full px-3 py-3 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={formData.phoneNumber} onChange={handleChange} />
          <input type="text" name="address" placeholder="Address"
            className="w-full px-3 py-3 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={formData.address} onChange={handleChange} />
          <select name="userRole"
            className="w-full px-3 py-3 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
            value={formData.userRole} onChange={handleChange}>
            <option value="User">User</option>
          </select>
          <input type="file" accept="image/*"
            className="w-full px-3 py-3 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream/70 outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-luxury-gold file:text-luxury-ink file:font-medium file:cursor-pointer"
            onChange={handleFileChange} />
        </div>

        {/* Image preview */}
        {profileImage && (
          <div className="mt-2 flex justify-center">
            <img src={URL.createObjectURL(profileImage)} alt="Preview"
              className="h-24 w-24 object-cover rounded-full border-2 border-luxury-gold/30 shadow-md" />
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={registerLoading}
          className="w-full bg-luxury-gold text-luxury-ink p-3 rounded-xl font-semibold hover:bg-luxury-gold-bright hover:shadow-[0_0_25px_rgba(224,186,106,0.5)] transition-all duration-300 disabled:opacity-50"
        >
          {registerLoading ? "Registering..." : "Register"}
        </motion.button>

        <p className="text-sm text-center text-luxury-cream/70">
          Already have an account?{" "}
          <Link to="/login" className="text-luxury-gold font-medium hover:underline underline-offset-2 transition-colors duration-300">
            Log in
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
