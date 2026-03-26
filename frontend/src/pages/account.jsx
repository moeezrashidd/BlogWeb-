import React, { useState, useEffect,  useContext } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profileContext } from '../Context/profileContext'
import Posts from './posts'
import Writers from '../components/writers'
const Account = () => {
  const {Profiles ,Loading,Error } = useContext(profileContext)
  
  const { id, username } = useParams()
  const [Account, setAccount] = useState([])
  
  useEffect(() => {
    setAccount(Profiles.filter((writer) => writer.username.id == parseInt(id)));
  }, [id,Profiles])
  
  // Calculate category after Account state updates
  const category = Account.length > 0 ? Account[0].category : undefined
  console.log(Account)
  return (
    <>
      <div className="">

        {Account.map((Account, index) => (

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            key={index}
            className="writer flex flex-col  items-center w-full 
        bg-white border border-gray-200  rounded-2xl 
        p-5 sm:p-1 gap-3 hover:border-blue-500 shadow-2xl 
        transition-all duration-300 cursor-pointer"
          >
            <div className="mainContainer flex w-full  gap-2 justify-evenly items-center py-3">
              <div className="picContainer  h-full flex justify-center items-center">
                <img
                  src={Account.profilePic}
                  alt={`${Account.username.name}'s avatar`}
                  className=" w-28 h-28 md:w-40 md:h-40 xl:w-48 xl:h-48 p-1 object-cover 
                rounded-full border-4 border-blue-500 shadow-2xl"
                />

                    

              </div>


              <div className="infoContainer flex flex-col justify-center items-start md:items-start gap-1">


                <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  {Account.username.name}
                </h3>

                <span className="text-base text-blue-500 font-medium -mt-2">@{Account.username.username}</span>

                <div className="followers md:flex hidden w-full min-w-80  justify-between pr-4 items-center mb-2">
                  <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'> {Account.following || "0"}</span><span className=' font-medium' >Following </span></span>
                  <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'>{Account.followers || "0"}</span><span className=' font-medium' >Followers </span></span>
                  <span className=" flex flex-col  justify-center items-center"><span className='text-blue-700 font-semibold text-lg'>{Account.posts || "0"}</span><span className=' font-medium'  >Posts </span></span>
                  <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'> {Account.likes || "0"}</span><span className=' font-medium' >Likes </span></span>
                </div>


                <p className="text-start md:flex hidden text-gray-700 text-sm md:text-base line-clamp-3">
                  {Account.bio}
                </p>

                <button
                  className="mt-3 px-6 py-2 bg-blue-600 md:flex hidden hover:bg-blue-700 
            text-white text-sm md:text-base font-semibold 
            rounded-xl shadow-md transition-all duration-300"
                >
                  Follow
                </button>
              </div>
            </div>


            <div className="md:hidden flex flex-col justify-start mb-3">

              <div className="followers flex justify-evenly items-center mb-2">
                <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'> {Account.noOfFollowing}</span><span className=' font-medium' >Following </span></span>
                <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'>{Account.followers}</span><span className=' font-medium' >Followers </span></span>
                <span className=" flex flex-col  justify-center items-center"><span className='text-blue-700 font-semibold text-lg'>{Account.noOfPosts}</span><span className=' font-medium'  >Posts </span></span>
                <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'> {Account.noOfLikes}</span><span className=' font-medium' >Likes </span></span>
              </div>

              <p className="text-center  text-gray-700 text-sm md:text-base line-clamp-3">
                {Account.bio}
              </p>

              <button
                className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 
            text-white text-sm md:text-base font-semibold 
            rounded-xl shadow-md transition-all duration-300"
              >
                Follow
              </button></div>
          </motion.div>
        ))}
      </div>

      <Posts username={username}/>
      <Writers  category={category} id={id}/>
    </>
  )
}

export default Account