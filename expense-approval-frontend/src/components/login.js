import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Spinner } from "./Spinner";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await loginUser(formData);
      setMessage("✅ Login Successful!");
      setUserData(data.user);
      setAccessToken(data.accessToken);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsNavigating(true);
      setTimeout(() => {
        navigate("/UserProfile");
        setIsNavigating(false);
      }, 5000);

      // setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setMessage("❌ Invalid username, email, or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (


<div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
  {/* Left: Login Card */}
  <div className="flex flex-1 justify-center items-center p-8">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
        🔐 Welcome Back
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Log in to your{" "}
        <span className="text-blue-600 font-semibold">BudgetSphere</span>{" "}
        account and manage your finances smartly.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition duration-300"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition duration-300"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition duration-300"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg font-semibold shadow-md hover:shadow-xl hover:opacity-95 transition-all duration-300"
        >
          Login
        </button>
      </form>

      {/* Messages */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-center text-sm font-medium animate-fade-in ${
            message.includes("✅")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
          {isNavigating && (
            <div className="mt-2 flex items-center justify-center text-blue-600">
              <Spinner className="w-5 h-5 mr-2" />
              <span>Redirecting to your profile...</span>
            </div>
          )}
          {/* User Data */}
          {userData && (
      <div className="mt-6 p-4 bg-gray-50 border rounded-lg shadow-sm text-sm text-gray-700 animate-fade-in">
        <h3 className="font-semibold mb-2">👤 User Details</h3>
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Post:</strong> {userData.post}
        </p>
      </div>
    )}

    {/* Token */}
    {accessToken && (
      <div className="mt-6 p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-lg shadow-inner overflow-auto max-h-32 animate-slide-up">
        <h3 className="font-semibold mb-2">🔑 Access Token</h3>
        <p className="break-all">{accessToken}</p>
      </div>
    )}

        </div>
      )}

      

      {/* Register Link */}
      <p className="mt-6 text-center text-gray-600 text-sm">
        New here?{" "}
        <span
          className="text-blue-600 font-medium cursor-pointer hover:underline transition"
          onClick={() => navigate("/register")}
        >
          Create an account
        </span>
      </p>
    </div>
  </div>

  {/* Right: Features After Login */}
  <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-white to-blue-50 p-10">
    <div className="max-w-lg">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 animate-slide-in">
        ✨ Unlock Powerful Features
      </h2>
      <ul className="space-y-4 text-gray-700 text-lg">
        <li className="flex items-center gap-3">
          ✅ Real-time Expense Tracking
        </li>
        <li className="flex items-center gap-3">
          📊 Smart Budgeting & Insights
        </li>
        <li className="flex items-center gap-3">
          🔔 Instant Notifications on Spending
        </li>
        <li className="flex items-center gap-3">
          🤝 Team/Family Expense Sharing
        </li>
        <li className="flex items-center gap-3">
          🔒 Secure Login & Data Privacy
        </li>
      </ul>
    </div>
  </div>
</div>



  );
};

export default Login;
