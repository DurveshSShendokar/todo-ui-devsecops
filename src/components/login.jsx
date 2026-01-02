import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { postRequest } from "../utils/apiClient";
import { ToastTypes, showToast} from "./toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.isAuthenticated) {
      navigate("/dashboard/todo", { replace: true });
    }
  }, [state?.isAuthenticated]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const endpoint = "/user/login";
    const request = { emailId: email, password };
    const response = await postRequest(endpoint, request);

    if (response) {
      sessionStorage.setItem(
        "userDetails",
        JSON.stringify(response.data?.data)
      );
      dispatch({ type: "LOGIN", payload: response.data?.data });
      showToast(response?.data.message, ToastTypes.success);
      navigate("/dashboard/todo");
    } else {
      const message = response?.response?.data?.message || "Login failed.";
      showToast(message, ToastTypes.error);
      setLoginError(message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex flex-col lg:flex-row overflow-hidden">
        {/* Logo & Intro Section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-b from-gray-700 to-gray-600 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-600">
          <img
            src="/images/logo-02.png"
            alt="Logo"
            className="h-24 sm:h-32 w-auto mb-4 transition-transform transform hover:scale-110 invert"
          />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 text-center">
            Welcome to Our App
          </h2>
          <p className="text-gray-300 text-center text-sm sm:text-base">
            Log in to access your dashboard. If you don't have an account, you
            can create one from this page.
          </p>
        </div>

        {/* Login Form Section */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 bg-gray-800">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 text-center">
            Log In
          </h2>
          <form onSubmit={handleLogin}>
            <div className="space-y-5">
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {loginError && (
              <div className="text-red-500 text-center mt-4 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="mt-6 w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md transition transform hover:scale-105"
            >
              Log In
            </button>
          </form>

          <div className="text-center mt-4">
            <a
              href="/forgotPassword"
              className="text-blue-500 hover:underline text-sm"
            >
              Forgot Password?
            </a>
          </div>

          <div className="text-center mt-4 text-gray-400 text-sm">
            Don't have an account?{" "}
            <a href="/signUp" className="text-blue-500 hover:underline">
              Create Account
            </a>
          </div>

          <div className="text-center mt-4 text-gray-400 text-sm">
            By logging in, you agree to our{" "}
            <a
              href="https://zionitai.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-gray-400 text-xs sm:text-sm">
        © 2024 ZIONIT. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
