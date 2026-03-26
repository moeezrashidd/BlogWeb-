import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex justify-center items-start px-4 py-10 sm:py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl border-2 border-gray-200 hover:border-blue-500 transition-colors duration-300 p-8 sm:p-12">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4">
          About <span className="text-blue-600">MR-Blog</span>
        </h1>
        <p className="text-center text-gray-600 text-lg mb-10">
          Sharing knowledge, stories, and inspiration with the world 🌍
        </p>

        {/* Content */}
        <div className="space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-blue-600">MR-Blog</span>!  
            This is a space where ideas meet creativity. Our goal is to create
            helpful, inspiring, and thought-provoking content for readers who
            love to learn and grow.
          </p>

          <p>
            Whether you are passionate about{" "}
            <span className="font-medium text-gray-900">
              technology, lifestyle, or education
            </span>
            , or simply enjoy exploring new perspectives — this website is
            built for you. Our team believes in simplifying complex topics and
            adding real value to your everyday life.
          </p>

          <p>
            What started with a simple idea —{" "}
            <span className="italic">to share knowledge that matters</span> —
            has now grown into a thriving community of curious minds, thinkers,
            and creators.
          </p>

          <p className="font-semibold text-gray-900">
            Thank you for being part of our journey 🙌  
            Keep exploring, keep learning, and stay inspired!
          </p>
        </div>

        {/* Portfolio Link */}
        <div className="flex justify-center items-center gap-2 font-medium mt-10">
          <span className="text-gray-700">Visit the developer’s portfolio →</span>
          <a
            href="https://moeez-rashid.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
          >
            Click Here
          </a>
        </div>

        {/* Call to Action */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/contact"
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;


