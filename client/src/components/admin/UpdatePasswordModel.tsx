
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../../redux/store";
// import { updatePassword } from "../../redux/auth/AuthThunk";
// import { clearPasswordUpdateState } from "../../redux/auth/AuthSlice";

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }

// const UpdatePasswordModel: React.FC<Props> = ({ open, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { passwordUpdateLoading, passwordUpdateError, passwordUpdateSuccess } = useSelector(
//     (s: RootState) => s.user
//   );

//   const [form, setForm] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   useEffect(() => {
//     if (!open) {
//       setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
//       dispatch(clearPasswordUpdateState());
//     }
//   }, [open, dispatch]);

//   useEffect(() => {
//     if (passwordUpdateSuccess) {
//       onClose();
//       dispatch(clearPasswordUpdateState());
//     }
//   }, [passwordUpdateSuccess, onClose, dispatch]);

//   if (!open) return null;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await dispatch(updatePassword(form));
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
//       <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
//         <h2 className="text-xl font-semibold mb-4 dark:text-white">Update Password</h2>

//         {passwordUpdateError && (
//           <div className="mb-3 rounded bg-red-100 px-3 py-2 text-red-700 text-sm">
//             {passwordUpdateError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="password"
//             name="oldPassword"
//             placeholder="Old password"
//             className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white"
//             value={form.oldPassword}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="newPassword"
//             placeholder="New password"
//             className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white"
//             value={form.newPassword}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm new password"
//             className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white"
//             value={form.confirmPassword}
//             onChange={handleChange}
//             required
//           />

//           <div className="mt-2 flex gap-3">
//             <button
//               type="submit"
//               disabled={passwordUpdateLoading}
//               className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
//             >
//               {passwordUpdateLoading ? "Updating..." : "Update Password"}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded border px-4 py-2 dark:text-white"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdatePasswordModel;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { updatePassword } from "../../redux/thunks/AuthThunk";
import { clearPasswordUpdateState } from "../../redux/slices/AuthSlice";
import { Eye, EyeOff, X } from "lucide-react"; // icons
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

const UpdatePasswordModel: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { passwordUpdateLoading, passwordUpdateError, passwordUpdateSuccess } = useSelector(
    (s: RootState) => s.user
  );

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (!open) {
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      dispatch(clearPasswordUpdateState());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (passwordUpdateSuccess) {
      onClose();
      dispatch(clearPasswordUpdateState());
    }
  }, [passwordUpdateSuccess, onClose, dispatch]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updatePassword(form));
  };

  const toggleVisibility = (field: "old" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-luxury-elevated border border-luxury-gold/20 p-6 shadow-[0_0_60px_-15px_rgba(201,162,75,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-luxury-gold/10 pb-2">
          <h2 className="font-logo text-2xl font-bold text-luxury-cream">
            Update Password
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-luxury-cream/70 hover:text-luxury-gold hover:bg-luxury-gold/10 transition-colors duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error */}
        {passwordUpdateError && (
          <div className="mb-3 rounded bg-red-950/40 border border-red-900/50 px-3 py-2 text-red-300 text-sm">
            {passwordUpdateError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-luxury-cream/80">
              Old Password
            </label>
            <input
              type={showPassword.old ? "text" : "password"}
              name="oldPassword"
              className="w-full rounded-md border border-luxury-gold/20 bg-luxury-ink px-3 py-2 pr-10 text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
              value={form.oldPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("old")}
              className="absolute right-3 top-8 text-luxury-cream/60 hover:text-luxury-gold-bright transition-colors duration-300"
            >
              {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-luxury-cream/80">
              New Password
            </label>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              className="w-full rounded-md border border-luxury-gold/20 bg-luxury-ink px-3 py-2 pr-10 text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("new")}
              className="absolute right-3 top-8 text-luxury-cream/60 hover:text-luxury-gold-bright transition-colors duration-300"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-luxury-cream/80">
              Confirm Password
            </label>
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              className="w-full rounded-md border border-luxury-gold/20 bg-luxury-ink px-3 py-2 pr-10 text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("confirm")}
              className="absolute right-3 top-8 text-luxury-cream/60 hover:text-luxury-gold-bright transition-colors duration-300"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-luxury-gold text-luxury-gold px-4 py-2 hover:bg-luxury-gold/10 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passwordUpdateLoading}
              className="rounded-lg bg-luxury-gold text-luxury-ink px-4 py-2 font-medium hover:bg-luxury-gold-bright transition-colors duration-300 disabled:opacity-50"
            >
              {passwordUpdateLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdatePasswordModel;
