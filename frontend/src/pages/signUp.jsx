import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",

  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {

      const user = await axios.post("http://127.0.0.1:8000/users/", formData)

      alert("Thanks for join our family!!Please Sign In........")
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",

      })
      return 1;
    } catch (error) {
      let usernameError = error.response.data.username
      let emailError = error.response.data.email
      
      if (usernameError){
        alert(usernameError)
      }
      else if(emailError){
        alert(emailError)
      }
      else{
        alert(error.message)
      }
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",

      })
    }


  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl py-10 px-6 sm:px-10 border-2 hover:border-blue-500 focus:border-blue-500">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 text-center">Create <span className="text-blue-600">Account</span></h1>
        <p className="text-gray-500 text-center mt-2">Join us today!</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a unique username"
              required
              className="h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="h-11 px-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[36px] text-gray-500 hover:text-gray-700 text-sm"
            >
              {showPassword ? "❌" : "👁️"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col relative">
            
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[36px] text-gray-500 hover:text-gray-700 text-sm"
            >
              
            </button>
          </div>

          {/* Sign In Redirect */}
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/signIn" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
