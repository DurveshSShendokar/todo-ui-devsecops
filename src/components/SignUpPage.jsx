import React, { useState } from "react";
import { fetchData } from "../utils/apiClient";
import { showToast, ToastTypes } from "./toast";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");
const handleSignup = async (event) => {
  event.preventDefault();

  try {
    const response = await fetchData("/user/register", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        mobileNumber: mobileNo,
        emailId,
        password,
      }),
    });

    if (response?.message) {
      showToast(response.message, ToastTypes.success);
      setFirstName("")
      setLastName("")
      setMobileNo("")
      setEmailId("")
      setPassword("")
    } else {
      setSignupError("Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Signup error:", error);
    setSignupError("An error occurred. Please try again.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex flex-col lg:flex-row overflow-hidden">
        
        <div className="flex-1 bg-gradient-to-b from-gray-700 to-gray-600 p-8 flex flex-col items-center justify-center border-r border-gray-600">
          <img
               src="/images/logo-02.png"
            alt="Logo"
            className="h-32 w-auto mb-4 transition-transform transform hover:scale-110 invert"
          />
          <h2 className="text-3xl font-extrabold text-white mb-4 text-center">
            Welcome to Our App
          </h2>
          <p className="text-gray-400 text-center">
            Create an account to get started. If you already have an account,
            you can log in from this page.
          </p>
        </div>

        <div className="flex-1 p-8">
          <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
            Sign Up
          </h2>
          <form onSubmit={handleSignup}>
            <div className="space-y-6">
              <input
                required
                type="text"
                placeholder="First Name"
                aria-label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-900 text-white border-gray-600 rounded-lg py-3 px-4 border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              />
              <input
                required
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-900 text-white border-gray-600 rounded-lg py-3 px-4 border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              />
              <input
                required
                type="number"
                placeholder="Mobile No"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="w-full bg-gray-900 text-white border-gray-600 rounded-lg py-3 px-4 border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              />
              <input
                required
                type="email"
                placeholder="Email-id"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="w-full bg-gray-900 text-white border-gray-600 rounded-lg py-3 px-4 border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 text-white border-gray-600 rounded-lg py-3 px-4 border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              />
            </div>
            {signupError && (
              <div className="text-red-500 text-center mt-4">{signupError}</div>
            )}
            <button
              type="submit"
              className="mt-8 w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log In
            </a>
          </p>
          <p className="text-center mt-4 text-gray-400">
            By signing up, you agree to our{" "}
          <a
  href="https://zionitai.com/privacy-policy"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 hover:underline"
>
  Privacy Policy
</a>

            .
          </p>
        </div>
      </div>

      <footer className="mt-6 text-center text-gray-400">
        © 2024 ZIONIT. All rights reserved.
      </footer>
    </div>
  );
};

export default SignUpPage;
