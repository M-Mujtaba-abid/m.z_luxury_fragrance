import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as reduxLogout } from "../../redux/slices/AuthSlice";
import type { AppDispatch } from "../../redux/store";
import { useLogoutMutation } from "../../queries/authQueries";

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Even if API call fails, clear local state
    }
    dispatch(reduxLogout());
    navigate("/login");
  };

  return (
    <button
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;
