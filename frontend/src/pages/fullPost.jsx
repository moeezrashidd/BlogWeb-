import React, { useEffect, useState,useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { postContext } from "../Context/postsContext";
import Posts from "./posts";
import { userContext } from "../Context/userContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import LexicalRenderer from "../components/LexicalRenderer";

const FullPost = () => {
  const{postData} = useContext(postContext)
  const { id } = useParams();
  const [Post, setPost] = useState([]);
  
  useEffect(() => {
    const tempPost = postData.filter((post) => post.id === parseInt(id));
    setPost(tempPost);
  }, [id , postData]);

  const category = Post.length > 0 ? Post[0].category : undefined
  const { currentUser } = useContext(userContext);

  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);

  useEffect(() => {
    if (Post.length > 0) {
      setLocalLikesCount(Post[0].likes || 0);
    }
  }, [Post]);

  useEffect(() => {
    const fetchLikeState = async () => {
      if (!currentUser || !id) return;
      try {
        const res = await fetch(
          `https://moeezrashidd.pythonanywhere.com/check_post_like/?actor_id=${currentUser.id}&post_id=${id}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setIsLiked(!!data.is_liked);
      } catch (e) {}
    };
    fetchLikeState();
  }, [currentUser, id]);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert("Please log in to like posts!");
      return;
    }
    if (!id) return;
    if (isLiking) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        await fetch("https://moeezrashidd.pythonanywhere.com/unlike_post/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actor_id: currentUser.id, post_id: id }),
        });
        setIsLiked(false);
        setLocalLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await fetch("https://moeezrashidd.pythonanywhere.com/like_post/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actor_id: currentUser.id, post_id: id }),
        });
        setIsLiked(true);
        setLocalLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  
  const getPostImageUrl = (images) => {
    if (!images || images.length === 0) return "/placeholder.jpg"; 
    const img = images[0]?.image;
    if (!img) return "/placeholder.jpg";
    return img.startsWith("http") ? img : `https://moeezrashidd.pythonanywhere.com${img}`;
  };

  return (
    <>
      {Post.map((item, index) => (
        <div
          key={index}
          className="post flex flex-col gap-6 my-6 px-4 sm:px-8 lg:px-20 py-6 bg-white shadow-xl rounded-2xl border border-gray-200"
        >
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
              {item.title}
            </h1>

            <button
              onClick={handleLikeToggle}
              disabled={isLiking}
              className="flex flex-col items-center justify-center cursor-pointer p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <span className="text-3xl">
                {isLiked ? <FaHeart className="text-red-600" /> : <FaRegHeart className="text-gray-600" />}
              </span>
              <span className="text-sm font-semibold text-gray-700 mt-1">{localLikesCount} {localLikesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>

          <img
            src={getPostImageUrl(item.images)}
            alt="Photo of Post"
            className="w-full rounded-xl shadow-md object-cover xl:h-[70vh]"
          />

          <div className="text-gray-800 text-base md:text-lg leading-relaxed">
            <LexicalRenderer content={item.content} />
          </div>

          <div className="flex flex-col gap-1 text-gray-600 text-sm sm:text-base">
            <div className="flex justify-between items-center w-full">
              <div>
                <span>
                  Writer:{" "}
                  <span className="text-black text-lg font-semibold hover:text-blue-600 border-b-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    {item.author.username}
                  </span>
                </span>
                <span className="block mt-1">
                  At:{" "}
                  <span className="text-black text-base font-medium">
                    {item.created_at}
                  </span>
                </span>
              </div>
              {currentUser && item.author && currentUser.id === item.author.id && (
                <Link
                  to={`/editPost/${item.id}`}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm active:scale-95"
                >
                  ✏️ Edit Post
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      <Posts propCategory={category} id={id}/>
    </>
  );
};

export default FullPost;
