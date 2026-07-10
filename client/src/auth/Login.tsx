

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { loginUser } from "../redux/auth/AuthThunk";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100 px-4"
      style={{
        backgroundImage: "url('/login2.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Login
        </h2>

        {/* Error message */}
        {error && <p className="text-red-500 text-center font-medium">{error}</p>}

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password with show/hide */}
        <div className="flex flex-col relative">
          <label className="text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[53px] right-3 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Links */}
        <div className="flex justify-between text-sm text-gray-600">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            <Link to="/forgot-password" className="text-blue-600 font-medium hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
