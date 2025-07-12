import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { loginUserAsync } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUserAsync(data)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Please check your credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faSignInAlt} />
          Login
        </h2>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1 relative">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
              className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-500 transition flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faSignInAlt} />
          Login
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
