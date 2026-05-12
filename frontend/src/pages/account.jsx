import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { userContext } from '../Context/userContext';
import { profileContext } from '../Context/profileContext';
import Posts from './posts';
import Writers from '../components/writers';

const Account = () => {


  const { currentUser } = useContext(userContext);
  const [isFollowing, setIsFollowing] = useState(false);
  console.log(currentUser)
  const handleFollow = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to follow users');
      return;
    }
    const actor_id = currentUser.id;
    const endpoint = isFollowing ? 'http://127.0.0.1:8000/unfollow/' : 'http://127.0.0.1:8000/follow/';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor_id, target_id: parseInt(id) })
      });
      if (response.ok) setIsFollowing(!isFollowing);
      else console.error('Failed to toggle follow');
    } catch (err) { console.error('Error toggling follow', err); }
  };

  const { id } = useParams()
  const { Profiles } = useContext(profileContext)
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    const asNumber = Number(id)
    if (!Number.isNaN(asNumber)) {
      setAccounts(Profiles.filter((writer) => writer?.username?.id === asNumber));
      return
    }
    // fallback for cases where the route param is not numeric (e.g. username)
    setAccounts(Profiles.filter((writer) => writer?.username?.username === id));
  }, [id, Profiles])

  // Calculate category after accounts state updates
  const category = accounts.length > 0 ? accounts[0].category : undefined
  console.log(accounts)
  return (
    <>
      <div className="">

        {accounts.map((account, index) => (

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
                  src={
                    account.profilePic
                      ? (account.profilePic.startsWith('http') ? account.profilePic : `http://127.0.0.1:8000${account.profilePic}`)
                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.username?.username || 'user'}`
                  }
                  alt={`${account.username?.name}'s avatar`}
                  className=" w-28 h-28 md:w-40 md:h-40 xl:w-48 xl:h-48 p-1 object-cover 
                rounded-full border-4 border-blue-500 shadow-2xl bg-white"
                />



              </div>


              <div className="infoContainer flex flex-col justify-center items-start md:items-start gap-1">


                <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  {account.username.name}
                </h3>

                <span className="text-base text-blue-500 font-medium -mt-2">@{account.username.username}</span>

                <div className="followers md:flex hidden w-full min-w-80  justify-between pr-4 items-center mb-2">

                  <div className="flex gap-6 items-center">

                    {/* Following */}
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-blue-700 font-semibold text-lg">
                        {account.following || "0"}
                      </span>
                      <span className="font-medium">Following</span>
                    </div>

                    {/* Followers */}
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-blue-700 font-semibold text-lg">
                        {account.followers || "0"}
                      </span>
                      <span className="font-medium">Followers</span>
                    </div>

                    {/* Posts */}
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-blue-700 font-semibold text-lg">
                        {account.posts || "0"}
                      </span>
                      <span className="font-medium">Posts</span>
                    </div>

                    {/* Likes */}
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-blue-700 font-semibold text-lg">
                        {account.likes || "0"}
                      </span>
                      <span className="font-medium">Likes</span>
                    </div>

                  </div>

                </div>


                <p className="text-start md:flex hidden text-gray-700 text-sm md:text-base line-clamp-3">
                  {account.bio}
                </p>

                <button
                  className="mt-3 px-6 py-2 bg-blue-600 md:flex hidden hover:bg-blue-700 
            text-white text-sm md:text-base font-semibold 
            rounded-xl shadow-md transition-all duration-300"
                  onClick={handleFollow}
                  disabled={!currentUser}
                >
                  Follow
                </button>
              </div>
            </div>


            <div className="md:hidden flex flex-col justify-start mb-3">

              <div className="followers flex justify-evenly items-center mb-2">
                <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'> {account.following || "0"}</span><span className=' font-medium' >Following </span></span>
                <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'>{account.followers || "0"}</span><span className=' font-medium' >Followers </span></span>
                <span className=" flex flex-col  justify-center items-center"><span className='text-blue-700 font-semibold text-lg'>{account.posts || "0"}</span><span className=' font-medium'  >Posts </span></span>
                <span className="  flex flex-col justify-center items-center"><span className='text-blue-700 font-semibold text-lg'> {account.likes || "0"}</span><span className=' font-medium' >Likes </span></span>
              </div>

              <p className="text-center  text-gray-700 text-sm md:text-base line-clamp-3">
                {account.bio}
              </p>

              <button
                className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 
            text-white text-sm md:text-base font-semibold 
            rounded-xl shadow-md transition-all duration-300"
                onClick={handleFollow}
                disabled={!currentUser}
              >
                Follow
              </button></div>
          </motion.div>
        ))}
      </div>


      <Posts username={accounts?.[0]?.username?.username ?? id} />
      <Writers category={category} id={id} />
    </>
  )
}

export default Account