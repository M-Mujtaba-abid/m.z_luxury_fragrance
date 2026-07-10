// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../redux/store";
// import { forgotPassword } from "../redux/auth/AuthThunk";
// import { clearForgotFlow } from "../redux/auth/AuthSlice";
// import { useNavigate } from "react-router-dom";

// const ForgetPassword: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { forgotLoading, forgotError, forgotSuccess } = useSelector((s: RootState) => s.user);

//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     dispatch(clearForgotFlow());
//   }, [dispatch]);

//   useEffect(() => {
//     if (forgotSuccess) {
//       navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
//     }
//   }, [forgotSuccess, email, navigate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email.trim()) return;
//     await dispatch(forgotPassword({ email }));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
//       <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
//         <h1 className="text-2xl font-bold dark:text-white">Forgot Password</h1>
//         {forgotError && <div className="text-red-600 text-sm">{forgotError}</div>}
//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={forgotLoading} className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50">
//           {forgotLoading ? "Sending..." : "Send OTP"}
//         </button>
//         <p className="text-xs text-gray-500 dark:text-gray-400">We will send a 6-digit OTP to your email.</p>
//       </form>
//     </div>
//   );
// };

// export default ForgetPassword;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { forgotPassword } from "../redux/auth/AuthThunk";
import { clearForgotFlow } from "../redux/auth/AuthSlice";
import { useNavigate } from "react-router-dom";

const ForgetPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { forgotLoading, forgotError, forgotSuccess } = useSelector(
    (s: RootState) => s.user
  );

  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(clearForgotFlow());
  }, [dispatch]);

  useEffect(() => {
    if (forgotSuccess) {
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
    }
  }, [forgotSuccess, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await dispatch(forgotPassword({ email }));
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen px-4"
      style={{
        backgroundImage: "url('/login2.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800">
          Forgot Password
        </h1>

        {/* Error message */}
        {forgotError && (
          <p className="text-red-500 text-center font-medium">{forgotError}</p>
        )}

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={forgotLoading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
        >
          {forgotLoading ? "Sending..." : "Send OTP"}
        </button>

        <p className="text-sm text-center text-gray-600">
          We will send a 6-digit OTP to your email.
        </p>
      </form>
    </div>
  );
};

export default ForgetPassword;
