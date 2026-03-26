import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔹 Replace this with your login API call
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 ">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl py-10 px-6 sm:px-10 border-2 hover:border-blue-500 focus:border-blue-500">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Welcome  <span className="text-blue-600">Back</span>
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Sign in to continue
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 mt-8"
        >
          {/* Email Input */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 px-4 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[35px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Sign Up Redirect */}
          <p className="text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link
              to="/signUp"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;


