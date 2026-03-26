import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { userContext } from '../Context/userContext'



const Writers = ({ category, id, searchText }) => {
  const { userData, Loading, error } = useContext(userContext)

  const [FilterWriters, setFilterWriters] = useState([])
  const [Items, setItems] = useState(8)

  useEffect(() => {
    let filtered = [...userData];
    console.log(filtered)
    // Apply category filter
    if (category) {
      filtered = filtered.filter((writer) => writer.category === category && writer.id !== parseInt(id));
    }
     if (searchText) {
      filtered = filtered.filter((writer) =>
        writer.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    
    setFilterWriters(filtered);
  }, [category, id, searchText,userData])


  useEffect(() => {
    const changeItemCount = () => {
      if (window.innerWidth < 840) {
        setItems(4);
      } else {
        setItems(8);
      }
    }

    changeItemCount()
    window.addEventListener("resize", changeItemCount)

    return () => window.removeEventListener("resize", changeItemCount)


  }, [])
  
  return (
    <div className="userData flex  justify-center items-center flex-col  gap-2 mt-6">
      <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4 '>{category || searchText ? "Related" : "Top"} <span className='text-blue-600'>Writers</span></h1>

      <div className="container flex flex-wrap justify-center gap-1 sm:gap-2 3xl:gap-4 mt-42 ">



        {FilterWriters.length >= 1 ? FilterWriters.slice(0, Items).map((writer, index) => (
          <WritersCard writer={writer} key={index} />
        )) : <span className='font-semibold text-red-700'>No Writer Available to Show</span>}

      </div>
    </div>
  )
}


import { motion } from "framer-motion";


export const WritersCard = ({ writer }) => {

  return (
    <Link to={`/account/${writer.id}/${writer.username}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="writer flex flex-col items-center w-[96vw] sm:w-[265px] md:w-[300px]
      bg-white border border-gray-200  rounded-2xl 
      p-5 gap-3 hover:border-blue-500 shadow-2xl 
      transition-all duration-300 cursor-pointer"
      >

        <img
          src={writer.avatar}
          alt={`${writer.name}'s avatar`}
          className="w-20 h-20 2xl:w-28 p-1 2xl:h-28 object-cover 
        rounded-full border-4 border-blue-500 shadow-2xl"
        />


        <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          {writer.name}
        </h3>

        <span className="text-sm text-blue-500 font-medium -mt-4">@{writer.username}</span>

        <p className="text-center text-gray-700 text-sm md:text-base line-clamp-3">
          {writer.bio}
        </p>

        <button
          className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 
        text-white text-sm md:text-base font-semibold 
        rounded-xl shadow-md transition-all duration-300"
        >
          Follow
        </button>
      </motion.div>
    </Link>
  );
};


export default Writers