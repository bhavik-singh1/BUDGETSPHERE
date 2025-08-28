import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      setMessage("Login Successful!");
      setUserData(data.user);
      setAccessToken(data.accessToken);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setMessage("Invalid username, email, or password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-6">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in">
        <h2 className="text-4xl font-bold text-center text-gray-700 mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-4 rounded-lg font-semibold tracking-wide hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-500 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-slide-in">
            <strong>{message}</strong>
          </div>
        )}

        {userData && (
          <div className="mt-6 p-6 bg-gray-100 border border-gray-400 text-gray-700 rounded-lg animate-slide-in">
            <h3 className="font-bold text-lg">User Details</h3>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Post:</strong> {userData.post}</p>
          </div>
        )}

        {accessToken && (
          <div className="mt-6 p-6 bg-gray-100 border border-gray-400 text-gray-700 rounded-lg animate-slide-in">
            <h3 className="font-bold text-lg">Authentication Token</h3>
            <p><strong>Access Token (Valid for 24 hrs):</strong></p>
            <div className="bg-gray-200 p-3 rounded-lg text-xs overflow-x-auto break-all max-h-24 overflow-y-auto">
              {accessToken}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-gray-600">
          New User? <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate("/register")}>
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
