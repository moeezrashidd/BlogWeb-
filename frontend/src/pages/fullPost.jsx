import React, { useEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";
import { postContext } from "../Context/postsContext";
import Posts from "./posts";
const FullPost = () => {
  const{postData} = useContext(postContext)
  const { id } = useParams();
  const [Post, setPost] = useState([]);
  const [DicsManage, setDicsManage] = useState(2000);
  
  useEffect(() => {
    const tempPost = postData.filter((post) => post.id === parseInt(id));
    setPost(tempPost);
  }, [id , postData]);

  

  const handleReadMore = (e) => {
    if (DicsManage < e) {
      setDicsManage((pre) => pre + 2000);
    } else {
      setDicsManage(2000);
    }
  };
  const category = Post.length > 0 ? Post[0].category : undefined
  return (
    <>
      {Post.map((item, index) => (
        <div
          key={index}
          className="post flex flex-col gap-6 my-6 px-4 sm:px-8 lg:px-20 py-6 
          bg-white shadow-xl rounded-2xl border border-gray-200"
        >
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
            {item.title}
          </h1>

          {/* Image */}
          <img
            src={`${item.photo}`}
            alt="Photo of Post"
            className="w-full rounded-xl shadow-md object-cover xl:h-[70vh]"
          />

          {/* Description */}
          <p className="text-gray-800 text-base md:text-lg leading-relaxed">
            {item.content.length > DicsManage
              ? item.content.slice(0, DicsManage) + "..."
              : item.content}
          </p>

          {/* Read More Button */}
          <div className="flex items-center justify-center gap-4 w-full my-6">
            <span className="hidden sm:flex flex-1 border-t"></span>

            <button
              onClick={() => handleReadMore(item.content.length)}
              className="px-5 py-2 text-lg sm:text-xl font-medium text-blue-600 
              border-2 border-blue-600 rounded-xl 
              hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              {DicsManage < item.content.length ? "Read More" : "Close"}
            </button>

            <span className="hidden sm:flex flex-1 border-t"></span>
          </div>

          {/* Writer Info */}
          <div className="flex flex-col gap-1 text-gray-600 text-sm sm:text-base">
            <span>
              Writer:{" "}
              <span
                className="text-black text-lg font-semibold hover:text-blue-600 
                border-b-2 border-transparent hover:border-blue-500 transition-all cursor-pointer"
              >
                {item.author.username}
              </span>
            </span>
            <span>
              At:{" "}
              <span className="text-black text-base font-medium">
                {item.created_at}
              </span>
            </span>
          </div>
        </div>
      ))}

      <Posts propCategory={category} id={id}/>
    </>
  );
};

export default FullPost;
