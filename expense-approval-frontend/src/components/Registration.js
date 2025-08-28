import React, { useState } from "react";
import { registerUser } from "../services/api"; // Make sure the API file is correct
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";



const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);

      // Check if registration is successful
      if (data?.token) {
        setMessage("Registration successful! 🎉");
        setToken(data.token);
        localStorage.setItem("accessToken", data.token);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in frontend:", error);
      setMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-gray-100 to-white p-10">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">Create an Account</h2>
        <p className="text-gray-500 mb-4">Sign up and get 30 days free trial</p>

        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md">
          <input
            type="text"
            name="username"
            placeholder="Full name"
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:outline-none transition-all duration-300 hover:shadow-xl"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:outline-none transition-all duration-300 hover:shadow-xl"
          />

          {/* Password with Show/Hide Icon */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:outline-none transition-all duration-300 hover:shadow-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center"
            >
              {showPassword ? <EyeOffIcon className="h-6 w-6 text-gray-500" /> : <EyeIcon className="h-6 w-6 text-gray-500" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white p-4 rounded-lg text-lg font-semibold tracking-wide hover:bg-yellow-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
          >
            Submit
          </button>

          {/* Social Login */}
          <div className="flex space-x-4 justify-center">
            <button className="p-3 border border-gray-300 rounded-lg flex items-center space-x-2">
              <img src="https://cdn-icons-png.flaticon.com/512/732/732217.png" alt="Apple" className="w-6 h-6" />
              <span>Apple</span>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg flex items-center space-x-2">
              <img src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png" alt="Google" className="w-6 h-6" />
              <span>Google</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-gray-500 text-center">
            Have an account? <a href="/login" className="text-blue-500 underline">Sign in</a>
          </p>
        </form>

        {/* Show Success/Error Message */}
        {message && (
          <h2 className={`text-center mt-4 text-sm font-semibold ${token ? "text-green-600" : "text-red-600"}`}>
            {message}
          </h2>
        )}

        {/* Display Access Token */}
        {token && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100 text-sm text-gray-800">
            <p className="font-semibold">Access Token:</p>
            <p className="break-all">{token}</p>
            <p className="text-red-600 font-medium mt-2">
              Please save this token for future use.
            </p>
          </div>
        )}
      </div>

      {/* Right Section - Background Image */}
      <div className="w-1/2 flex justify-center items-center p-6 lg:flex">
        <div
          className="bg-cover bg-center rounded-3xl shadow-2xl p-4 h-80 w-3/4 md:h-96 md:w-2/3 lg:h-full lg:w-full transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
          style={{ backgroundImage: "url('/registration.jpg')" }}
        ></div>
      </div>
    </div>
  );
};

export default Registration;
