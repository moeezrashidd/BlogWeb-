import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegHeart ,FaRegSave} from "react-icons/fa";
const PostCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="postCard w-full sm:w-[48%] md:w-[350px] lg:w-[400px] 
        bg-white rounded-2xl shadow-2xl border border-gray-200 
        hover:border-blue-500 
        p-5 flex flex-col justify-between gap-3 transition-all duration-300 relative"
    >
      {/* Title */}
      <h2 className="title text-xl font-bold text-gray-900 line-clamp-2">
        {item.title}
      </h2>

      {/* content */}
      <p className="dec text-gray-700 text-sm md:text-base line-clamp-3">
        {item.content.length > 150
          ? item.content.slice(0, 150) + "..."
          : item.content}
      </p>

      {/* Meta Info */}
      <div className="flex flex-col gap-1 text-sm text-gray-600">
        <p>
          <span className="font-semibold text-gray-800">Author:</span>{" "}
          {item.author.username} 
        </p>
       
        <p className="hidden md:block">
          <span className="font-semibold text-gray-800">Created at:</span> {item.created_at}
        </p>
      </div>

      {/* Read More Button */}
      <Link
        to={`/post/${item.id}/${item.title}`}
        className="mt-3 w-full sm:w-auto px-5 py-2 
          bg-blue-600 text-white font-medium rounded-xl 
          text-center hover:bg-blue-700 transition-all duration-300"
      >
        Read More
      </Link>


      <div className="absolute right-4 top-3 z-50  flex flex-col justify-center items-center gap-3">
        <span className="text-2xl hover:text-red-600 cursor-pointer"><FaRegHeart /></span>
        <span className="text-2xl hover:text-blue-600 cursor-pointer "><FaRegSave /></span>
      </div>
    </motion.div>
  );
};

export default PostCard;
