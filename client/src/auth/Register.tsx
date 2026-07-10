// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../redux/store";
// import { registerUser } from "../redux/auth/AuthThunk";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const Register: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { loading, error, success } = useSelector(
//     (state: RootState) => state.user
//   );

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     address: "",
//     userRole: "User",
//   });

//   const [profileImage, setProfileImage] = useState<File | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setProfileImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // FormData banana file bhejne ke liye
//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       data.append(key, value);
//     });
//     if (profileImage) {
//       data.append("profileImage", profileImage);
//     }

//     try {
//       await dispatch(registerUser(data)).unwrap();
//       // ✅ Registration successful → redirect to login
//       navigate("/login", { replace: true, state: { from: "register" } });
//     } catch (err) {
//       // Error already handled in thunk; no-op here
//     }
//   };

//   return (

// <div
//   className="flex justify-center items-center min-h-screen px-4"
//   style={{
//     backgroundImage: "url('/login2.jpeg')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//   }}
// >
//   <form
//     onSubmit={handleSubmit}
//     className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
//   >
//     {/* Heading */}
//     <h1 className="text-3xl font-extrabold text-center text-gray-800">
//       Register
//     </h1>

//     {/* Messages */}
//     {error && <p className="text-red-500 text-center font-medium">{error}</p>}
//     {success && (
//       <p className="text-green-500 text-center font-medium">
//         Registration successful!
//       </p>
//     )}

//     {/* Form Inputs */}
//     <div className="flex flex-col space-y-3">
//       <input
//         type="text"
//         name="firstName"
//         placeholder="First Name"
//         className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={formData.firstName}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="text"
//         name="lastName"
//         placeholder="Last Name"
//         className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={formData.lastName}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={formData.email}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={formData.password}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="text"
//         name="phoneNumber"
//         placeholder="Phone Number"
//         className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={formData.phoneNumber}
//         onChange={handleChange}
//       />
//       <input
//         type="text"
//         name="address"
//         placeholder="Address"
//         className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={formData.address}
//         onChange={handleChange}
//       />

//       <select
//         name="userRole"
//         className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={formData.userRole}
//         onChange={handleChange}
//       >
//         <option value="User">User</option>
//         <option value="Admin">Admin</option>
//       </select>

//       {/* File input for image */}
//       <input
//         type="file"
//         accept="image/*"
//         className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         onChange={handleFileChange}
//       />

//       {/* Image preview */}
//       {profileImage && (
//         <div className="mt-2 flex justify-center">
//           <img
//             src={URL.createObjectURL(profileImage)}
//             alt="Preview"
//             className="h-24 w-24 object-cover rounded-full shadow-md"
//           />
//         </div>
//       )}
//     </div>

//     {/* Submit Button */}
//     <button
//       type="submit"
//       disabled={loading}
//       className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
//     >
//       {loading ? "Registering..." : "Register"}
//     </button>

//     {/* Login link */}
//     <p className="text-sm text-center text-gray-600">
//       Already have an account?{" "}
//       <Link to="/login" className="text-blue-600 font-medium hover:underline">
//         Log in
//       </Link>
//     </p>
//   </form>
// </div>

//   );
// };

// export default Register;



import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { registerUser } from "../redux/auth/AuthThunk";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // for password toggle

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.user
  );

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (profileImage) {
      data.append("profileImage", profileImage);
    }

    try {
      await dispatch(registerUser(data)).unwrap();
      navigate("/login", { replace: true, state: { from: "register" } });
    } catch (err) {
      // Error handled in thunk
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
      className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-[600px] space-y-6"
    >
      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-center text-gray-800">
        Register
      </h1>
  
      {/* Messages */}
      {error && <p className="text-red-500 text-center font-medium">{error}</p>}
      {success && <p className="text-green-500 text-center font-medium">{success}</p>}
  
      {/* Grid for Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1: First Name + Last Name */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
  
        {/* Row 2: Email + Password */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
  
        {/* Row 3: Phone Number + Address */}
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={formData.address}
          onChange={handleChange}
        />
  
        {/* Row 4: User Role + File Input */}
        <select
          name="userRole"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={formData.userRole}
          onChange={handleChange}
        >
          <option value="User">User</option>
          {/* <option value="Admin">Admin</option> */}
        </select>
        <input
          type="file"
          accept="image/*"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={handleFileChange}
        />
      </div>
  
      {/* Image preview */}
      {profileImage && (
        <div className="mt-2 flex justify-center">
          <img
            src={URL.createObjectURL(profileImage)}
            alt="Preview"
            className="h-24 w-24 object-cover rounded-full shadow-md"
          />
        </div>
      )}
  
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
      >
        {loading ? "Registering..." : "Register"}
      </button>
  
      {/* Login link */}
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  </div>
  
  );
};

export default Register;
