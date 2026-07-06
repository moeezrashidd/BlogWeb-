import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaRegSave } from "react-icons/fa";
import { userContext } from "../Context/userContext";
import { extractPlainText } from "./LexicalRenderer";

const PostCard = ({ item }) => {
  const { currentUser } = useContext(userContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(item.likes || 0);
  const abortRef = React.useRef(null);

  const actorId = currentUser?.id;
  const postId = item?.id;

  const isReady = useMemo(() => {
    return actorId && postId;
  }, [actorId, postId]);

  useEffect(() => {
    if (!isReady) return;

    // Cancel previous request if user switches quickly between posts.
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchLikeState = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/check_post_like/?actor_id=${actorId}&post_id=${postId}`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        setIsLiked(!!data.is_liked);
      } catch (err) {
        if (err?.name !== 'AbortError') console.error(err);
      }
    };

    fetchLikeState();

    return () => controller.abort();
  }, [isReady, actorId, postId]);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert("Please log in to like posts!");
      return;
    }
    if (!postId) return;
    if (isLiking) return;

    setIsLiked((prev) => !prev);
    setLocalLikesCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));

    setIsLiking(true);
    try {
      if (isLiked) {
        await fetch("http://127.0.0.1:8000/unlike_post/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actor_id: currentUser.id, post_id: postId }),
        });
      } else {
        await fetch("http://127.0.0.1:8000/like_post/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actor_id: currentUser.id, post_id: postId }),
        });
      }
    } catch (err) {
      console.error(err);

      // If server request fails, revert optimistic UI.
      setIsLiked((prev) => !prev);
      setLocalLikesCount((prev) => (isLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="postCard w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-12px)] max-w-sm
        bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200
        hover:border-blue-500
        p-3 sm:p-5 flex flex-col justify-between gap-2 sm:gap-3 transition-all duration-300 relative"
    >
      <h2 className="title text-base sm:text-xl font-bold text-gray-900 line-clamp-2 pr-8">
        {item.title}
      </h2>

      <p className="dec text-gray-600 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3">
        {(() => {
          const plain = extractPlainText(item.content);
          return plain.length > 120 ? plain.slice(0, 120) + '...' : plain;
        })()}
      </p>

      {/* Meta Info */}
      <div className="flex flex-col gap-0.5 text-xs sm:text-sm text-gray-600">
        <p>
          <span className="font-semibold text-gray-800">Author:</span>{" "}
          {item.author.username}
        </p>
        <p className="hidden sm:block">
          <span className="font-semibold text-gray-800">Created at:</span> {item.created_at}
        </p>
      </div>

      {/* Read More Button */}
      <Link
        to={`/post/${item.id}/${item.title}`}
        className="mt-1 sm:mt-2 w-full px-4 py-1.5 sm:py-2
          bg-blue-600 text-white font-medium rounded-lg sm:rounded-xl
          text-xs sm:text-sm text-center hover:bg-blue-700 transition-all duration-300"
      >
        Read More
      </Link>


      <div className="absolute right-2 sm:right-4 top-2 sm:top-3 z-50 flex flex-col justify-center items-center gap-2">
        <span
          role="button"
          aria-label={isLiked ? "Unlike" : "Like"}
          onClick={handleLikeToggle}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <span className="text-lg sm:text-2xl">
            {isLiked ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-gray-600">{localLikesCount}</span>
        </span>
        <span className="text-lg sm:text-2xl hover:text-blue-600 cursor-pointer"><FaRegSave /></span>
      </div>

    </motion.div>
  );
};

export default PostCard;
