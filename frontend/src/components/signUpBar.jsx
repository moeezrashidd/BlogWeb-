import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const SignUpBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl mt-6 shadow-lg"
    >
      <h1 className="text-2xl sm:text-4xl text-white font-bold text-center sm:text-left leading-snug">
        Join Our <br className="sm:hidden" /> Community
      </h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-semibold shadow-md hover:bg-blue-50 transition duration-300"
      >
       <Link to="/signUp">Sign Up</Link> 
      </motion.button>
    </motion.div>
  );
};

export default SignUpBar;
