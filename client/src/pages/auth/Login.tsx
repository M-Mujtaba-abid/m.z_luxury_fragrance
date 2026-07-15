

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { loginUser } from "../../redux/thunks/AuthThunk";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, user, token } = useSelector(
    (state: RootState) => state.user
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (user && token) {
      if (user.userRole === "Admin") {
        navigate("/admin");
      } else {
        navigate("/web");
      }
    }
  }, [user, token, navigate]);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-luxury-ink px-4 overflow-hidden">
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
        className="relative bg-luxury-card/80 backdrop-blur-xl border border-luxury-gold/20 shadow-[0_0_60px_-15px_rgba(201,162,75,0.35)] p-8 rounded-2xl w-full max-w-md space-y-6"
      >
        {/* Heading */}
        <h2 className="font-logo text-4xl font-bold text-center text-luxury-cream">
          Login
        </h2>

        {/* Error message */}
        {error && <p className="text-red-400 text-center font-medium">{error}</p>}

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-luxury-cream/80 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-3 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password with show/hide */}
        <div className="flex flex-col relative">
          <label className="text-sm font-semibold text-luxury-cream/80 mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full px-3 py-3 pr-10 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[53px] right-3 -translate-y-1/2 text-luxury-cream/60 hover:text-luxury-gold-bright transition-colors duration-300"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-luxury-gold text-luxury-ink p-3 rounded-xl font-semibold hover:bg-luxury-gold-bright hover:shadow-[0_0_25px_rgba(224,186,106,0.5)] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        {/* Links */}
        <div className="flex justify-between text-sm text-luxury-cream/70">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-luxury-gold font-medium hover:underline underline-offset-2 transition-colors duration-300">
              Sign up
            </Link>
          </p>
          <p>
            <Link to="/forgot-password" className="text-luxury-gold font-medium hover:underline underline-offset-2 transition-colors duration-300">
              Forgot Password?
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
