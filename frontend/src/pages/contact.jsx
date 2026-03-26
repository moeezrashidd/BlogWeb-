import React from "react";

const Contact = () => {
  return (
    <div className="flex justify-center items-start px-4 py-10 sm:py-16 bg-gray-50 min-h-screen">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl border border-gray-200 p-8 sm:p-12">
        
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4">
          Contact <span className="text-blue-600">Us</span>
        </h1>
        <p className="text-center text-gray-600 text-lg mb-10">
          We’d love to hear from you! Fill out the form below and we’ll get back to you soon. ✨
        </p>

        {/* Form */}
        <form className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Your Name
            </label>
            <input-
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="Type your message here..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Extra Info */}
        <div className="mt-10 text-center text-gray-600">
          <p>
            Or reach us directly at{" "}
            <a
              href="mailto:moeezrashidd@gmail.com"
              className="text-blue-600 font-semibold hover:underline"
            >
              moeezrashidd@gmail.com
            </a>
          </p>
          <p className="mt-2">
            Portfolio:{" "}
            <a
              href="https://moeez-rashid.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline"
            >
              moeez-rashid.vercel.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
