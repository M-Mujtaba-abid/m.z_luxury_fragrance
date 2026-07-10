
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
import { updatePassword } from "../../redux/auth/AuthThunk";
import { clearPasswordUpdateState } from "../../redux/auth/AuthSlice";
import { Eye, EyeOff, X } from "lucide-react"; // icons

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Update Password
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Error */}
        {passwordUpdateError && (
          <div className="mb-3 rounded bg-red-100 px-3 py-2 text-red-700 text-sm">
            {passwordUpdateError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Old Password
            </label>
            <input
              type={showPassword.old ? "text" : "password"}
              name="oldPassword"
              className="w-full rounded-lg border px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              value={form.oldPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("old")}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              className="w-full rounded-lg border px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("new")}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              className="w-full rounded-lg border px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => toggleVisibility("confirm")}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passwordUpdateLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {passwordUpdateLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModel;
