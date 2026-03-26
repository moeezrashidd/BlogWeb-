import React, { useState, useEffect , useContext} from 'react'
import { categories } from '../Context/data.jsx'
import PostCard from '../components/postCard'
import { GoArrowUpRight } from "react-icons/go";
import { Link } from 'react-router-dom';
import { postContext } from '../Context/postsContext.jsx';

const Categories = () => {
const {postData} = useContext(postContext)

  const [Items, setItems] = useState(6)
useEffect(() => {
    const changeItemCount =()=>{
        if (window.innerWidth < 840) {
            setItems(4); 
          }  else {
            setItems(6); 
          }
    }   

     changeItemCount()
     window.addEventListener("resize" , changeItemCount)

     return ()=> window.removeEventListener("resize" , changeItemCount)


}, [])
  return (
    <div className="flex flex-col gap-6 mt-6">

      {categories.map((curCategory, index) => (
        <div key={index} className="flex flex-col gap-2">
         <Link to={`/posts/${encodeURIComponent(curCategory)}`} className='text-3xl xl:4xl font-bold hover:text-blue-500 cursor-pointer text-center '>{curCategory}</Link>

         
          <div className="parent flex flex-wrap justify-center gap-1 sm:gap-4 mt-4">

            {postData.filter((post) => post.category === curCategory).slice(0, Items).map((item, index) => (
              <PostCard key={index} item={item} />
            ))

            }


          </div>
          <div className="flex items-center justify-center gap-4 w-full my-6">
            <span className="hidden sm:flex flex-1 border-t-2"></span>
         
              <Link to={`/posts/${encodeURIComponent(curCategory)}`} className={`text-center flex text-lg justify-center items-center gap-2 sm:text-xl font-normal text-blue-500  hover:text-white hover:bg-blue-500 border-2 border-blue-500 px-3 rounded-xl cursor-pointer `}>Show All <GoArrowUpRight /></Link>

            <span className="hidden sm:flex flex-1 border-t-2"></span>
          </div>
        </div>
      ))}


    </div>
  )
}

export default Categories
