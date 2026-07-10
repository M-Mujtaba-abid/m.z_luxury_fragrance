import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/auth/AuthThunk";
import type { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <button
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default Logout;
