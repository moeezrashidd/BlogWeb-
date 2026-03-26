import React, { useEffect, useState,useContext } from 'react'
import PostCard from '../components/postCard'
import { useParams } from "react-router-dom"
import { postContext } from '../Context/postsContext.jsx'
const Posts = ({ username, id, propCategory, searchText }) => {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : null

  const finalCategory = decodedCategory || propCategory;
  const { postData, Error, Loading } = useContext(postContext)

  const [Posts, setPosts] = useState([])
  const [PostCount, setPostCount] = useState(6)
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {

    
    let filtered = [...postData];

     if (finalCategory) {
      filtered = filtered.filter(p => p.category === finalCategory);
    }

     if (username) {
      filtered = filtered.filter(p => p.author.username === username);
    }

 
    if (searchText) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchText.toLowerCase()) || 
        post.author.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (id) {
      filtered = filtered.filter(post => post.id !== id);
    }
  

    setFilteredPosts(filtered);
  }, [finalCategory, username, id, searchText ,postData])



  const handleShowMorePosts = () => {
    if (PostCount >= filteredPosts.length) {
      setPostCount(6)
    }
    else {
      setPostCount((pre) =>
        pre + 3
      )
    }
  }

  const handleShowLessPosts = () => {
    if (PostCount <= 6) {
      setPostCount(6)
    }
    else {
      setPostCount((pre) =>
        pre - 3
      )
    }
  }
console.log(postData)




  useEffect(() => {
    if (filteredPosts.length > 6) {
      const TempPosts = filteredPosts.slice(0, PostCount)
      setPosts(TempPosts)
    }
    else {
      setPosts(filteredPosts)
    }
  }, [PostCount, filteredPosts])





  return (
    <>
      <div className="flex items-center justify-center gap-4 w-full my-9">

        <span className="hidden sm:flex flex-1 border-t-2"></span>


        <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4 '> 
          { decodedCategory || username ? username ? "": `${decodedCategory}` : "Related"} 
          <span className='text-blue-600'> Posts</span>
        </h1>


        <span className="hidden sm:flex flex-1 border-t-2"></span>
      </div>


      <div className="parent flex flex-wrap justify-center gap-1 sm:gap-4 mt-4">
        {Posts.length >= 1 ?
          Posts.map((item, index) => {

            return <PostCard item={item} key={index} />

          })
          : <span className='font-semibold text-red-700 '>No Post Available to Show</span>}

      </div>

      <div className="flex items-center justify-center gap-4 w-full my-9">

        <span className="hidden sm:flex flex-1 border-t-2"></span>



        {filteredPosts.length > 6 && (
          <>
            <span 
              className={`text-center text-lg sm:text-xl font-normal text-blue-500 hover:text-white hover:bg-blue-500 border-2 border-blue-500 px-3 rounded-xl cursor-pointer transition-all duration-300 ${
                PostCount >= filteredPosts.length ? "hidden" : "inline"
              }`}
              onClick={handleShowMorePosts}
            >
              Show More
            </span>
            <span 
              className={`text-center text-lg sm:text-xl font-normal text-blue-500 hover:text-white hover:bg-blue-500 border-2 border-blue-500 px-3 rounded-xl cursor-pointer transition-all duration-300 ${
                PostCount > 6 ? "inline" : "hidden"
              }`} 
              onClick={handleShowLessPosts}
            >
              Show Less
            </span>
          </>
        )}


        <span className="hidden sm:flex flex-1 border-t-2"></span>
      </div >


    </>
  )
}

export default Posts

