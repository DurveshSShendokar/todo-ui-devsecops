import React, { useState } from "react";
import { X } from "lucide-react";
import { postRequest, fetchData } from "../utils/apiClient";
import { ToastTypes, showToast } from "../components/toast";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ show, setShow }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginForm, setLoginForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const { dispatch } = useAuth(); // Use AuthContext
  const navigate = useNavigate(); // For navigation

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (isSignUp) {
      // Handle signup
      try {
        const response = await fetchData("/user/register", {
          method: "POST",
          body: JSON.stringify({
            firstName: loginForm.firstName,
            lastName: loginForm.lastName,
            mobileNumber: loginForm.mobile,
            emailId: loginForm.email,
            password: loginForm.password,
          }),
        });

        if (response?.message) {
          showToast(response.message, ToastTypes.success);
          // Reset form after successful signup
          setLoginForm({
            firstName: "",
            lastName: "",
            mobile: "",
            email: "",
            password: "",
          });

          setIsSignUp(false);
        } else {
          setLoginError("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Signup error:", error);
        setLoginError("An error occurred. Please try again.");
      }
      return;
    }

    // Handle login
    const endpoint = "/user/login";
    const request = { emailId: loginForm.email, password: loginForm.password };
    const response = await postRequest(endpoint, request);

    if (response && response.data && response.data.data) {
      sessionStorage.setItem("userDetails", JSON.stringify(response.data.data));
      dispatch({ type: "LOGIN", payload: response.data.data });
      showToast(response?.data.message, ToastTypes.success);
      setShow(false);
      navigate("/dashboard/todo");
    } else {
      const message = response?.response?.data?.message || "Login failed.";
      showToast(message, ToastTypes.error);
      setLoginError(message);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setLoginForm({
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
    });
    setLoginError("");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-lg w-full mx-4 border border-white/20 shadow-2xl relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? "Sign Up" : "Log In"}
          </h2>
          <p className="text-gray-400">
            {isSignUp ? "Join ZioTeams today" : "Welcome back to ZioTeams"}
          </p>
        </div>
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={loginForm.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required={isSignUp}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={loginForm.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required={isSignUp}
                />
              </div>
              <div>
                <input
                  type="number"
                  name="mobile"
                  placeholder="Mobile No"
                  value={loginForm.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required={isSignUp}
                />
              </div>
            </>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email-id"
              value={loginForm.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>
          {loginError && (
            <div className="text-red-500 text-center text-sm">{loginError}</div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
        {!isSignUp && (
          <div className="text-center mt-4">
            <button
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              type="button"
              onClick={() => {
                setShow(false);
                navigate("/forgotPassword");
              }}
            >
              Forgot Password?
            </button>
          </div>
        )}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={toggleAuthMode}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            By {isSignUp ? "signing up" : "logging in"}, you agree to our{" "}
            <a
              href="https://zionitai.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
