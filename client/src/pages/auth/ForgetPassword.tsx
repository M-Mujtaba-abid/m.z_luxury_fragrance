import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../queries/authQueries";

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: forgotPassword, isPending: forgotLoading, error: forgotErr, isSuccess: forgotSuccess } =
    useForgotPasswordMutation();
  const forgotError = forgotErr?.message ?? null;

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (forgotSuccess) {
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
    }
  }, [forgotSuccess, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await forgotPassword({ email });
    } catch {
      // error shown via forgotError
    }
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
        <h1 className="text-3xl font-extrabold text-center text-gray-800">
          Forgot Password
        </h1>

        {forgotError && (
          <p className="text-red-500 text-center font-medium">{forgotError}</p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={forgotLoading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-50"
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
