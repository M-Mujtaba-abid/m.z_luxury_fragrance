import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useResetPasswordMutation } from "../../queries/authQueries";

const SetNewPassword: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  const { mutateAsync: resetPassword, isPending: resetLoading, error: resetErr, isSuccess: resetSuccess } =
    useResetPasswordMutation();
  const resetError = resetErr?.message ?? null;

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (resetSuccess) navigate("/login", { replace: true });
  }, [resetSuccess, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.newPassword || form.newPassword !== form.confirmPassword) return;
    try {
      await resetPassword({ email, ...form });
    } catch {
      // error shown via resetError
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('/login2.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-xl shadow-lg p-6 space-y-4 
        bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20"
      >
        <h1 className="text-2xl font-bold text-center dark:text-white text-gray-900">
          Set New Password
        </h1>

        {resetError && (
          <div className="text-red-600 text-sm text-center">{resetError}</div>
        )}

        {/* New Password */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            name="newPassword"
            placeholder="New password"
            className="w-full rounded-md border px-3 py-2 pr-10 
            bg-white/60 dark:bg-gray-700/60 dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
          >
            {showNew ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            className="w-full rounded-md border px-3 py-2 pr-10 
            bg-white/60 dark:bg-gray-700/60 dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
          >
            {showConfirm ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={resetLoading}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 
          text-white py-2 font-semibold shadow-md transition disabled:opacity-50"
        >
          {resetLoading ? "Saving..." : "Save Password"}
        </button>
      </form>
    </div>
  );
};

export default SetNewPassword;
