import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faPlus,
  faChartColumn,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function NavigationBar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      dispatch(logout());
      Swal.fire({
        icon: "success",
        title: "Logged out",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/login");
    }
  };

  const handleCreateThread = () => {
    Swal.fire({
      icon: "info",
      title: "Login Required",
      text: "Kamu harus login dulu untuk membuat thread.",
      confirmButtonText: "Login",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex space-x-4">
            {/* Threads */}
            <Link
              to="/"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faComments} />
              Threads
            </Link>

            {/* Create Thread */}
            {user ? (
              <Link
                to="/create-thread"
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faPlus} />
                Create Thread
              </Link>
            ) : (
              <button
                onClick={handleCreateThread}
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faPlus} />
                Create Thread
              </button>
            )}

            {/* Leaderboards */}
            <Link
              to="/leaderboards"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faChartColumn} />
              Leaderboards
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  👋 Hello, <strong>{user.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 bg-red-500 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
