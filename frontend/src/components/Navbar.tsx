import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-bold text-lg">
          Sweet Shop
        </Link>

        {/* Nav links */}
        <div className="space-x-4 flex items-center">
          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="hover:underline">
                  Admin Dashboard
                </Link>
              )}
              <span className="text-gray-700 font-medium">
                Hi, {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
