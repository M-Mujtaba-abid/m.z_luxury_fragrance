import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { verifyOtp, forgotPassword } from "../redux/auth/AuthThunk";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyOtp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const { verifyLoading, verifyError, verifySuccess, forgotLoading } = useSelector((s: RootState) => s.user);

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(600); // 10 mins

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (verifySuccess) {
      navigate(`/set-new-password?email=${encodeURIComponent(email)}`, { replace: true });
    }
  }, [verifySuccess, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    await dispatch(verifyOtp({ email, otp }));
  };

  const handleResend = async () => {
    if (!email) return;
    await dispatch(forgotPassword({ email }));
    setSeconds(600);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

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
      Verify OTP
    </h1>

    {/* Error Message */}
    {verifyError && (
      <p className="text-red-500 text-center font-medium">{verifyError}</p>
    )}

    {/* Info */}
    <p className="text-sm text-center text-gray-600">
      We sent a code to: <span className="font-semibold">{email}</span>
    </p>

    {/* OTP Input */}
    <input
      type="text"
      placeholder="Enter 6-digit OTP"
      className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-center tracking-widest"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      maxLength={6}
      required
    />

    {/* Timer + Resend */}
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>Expires in {mm}:{ss}</span>
      <button
        type="button"
        disabled={seconds > 0 || forgotLoading}
        onClick={handleResend}
        className="text-blue-600 disabled:opacity-50 font-medium hover:underline"
      >
        Resend OTP
      </button>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={verifyLoading}
      className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
    >
      {verifyLoading ? "Verifying..." : "Verify"}
    </button>
  </form>
</div>

  );
};

export default VerifyOtp;
