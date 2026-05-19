import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { userContext } from '../Context/userContext'
import { profileContext } from '../Context/profileContext'
import Posts from './posts'
import Writers from '../components/writers'
import FollowModal from '../components/FollowModal'
import EditProfileModal from '../components/EditProfileModal'

const Account = () => {
  const { currentUser } = useContext(userContext)
  const { id } = useParams()

  const [isFollowing, setIsFollowing] = useState(false)
  const [isTogglingFollow, setIsTogglingFollow] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalUsers, setModalUsers] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const isOwnProfile = !!currentUser && Number(id) === currentUser.id
  const canFollow = !isOwnProfile

  const { Profiles, refreshProfiles } = useContext(profileContext)
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    const targetId = parseInt(id, 10)
    if (!currentUser || Number.isNaN(targetId)) return

    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/check_follow_status/?actor_id=${currentUser.id}&target_id=${targetId}`
        )
        if (response.ok) {
          const data = await response.json()
          setIsFollowing(!!data.is_following)
        }
      } catch (error) {
        console.error('Error fetching follow status', error)
      }
    }

    if (canFollow) fetchFollowStatus()
  }, [currentUser, id, canFollow])

  useEffect(() => {
    const asNumber = Number(id)
    if (!Number.isNaN(asNumber)) {
      setAccounts((Profiles || []).filter((writer) => writer?.username?.id === asNumber))
      return
    }

    setAccounts((Profiles || []).filter((writer) => writer?.username?.username === id))
  }, [id, Profiles])

  const category = accounts.length > 0 ? accounts[0].category : undefined

  const handleOpenFollowers = async (userId) => {
    setModalTitle('Followers')
    setModalUsers([])
    setModalOpen(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/followers/${userId}/`)
      if (response.ok) {
        const data = await response.json()
        setModalUsers(data)
      }
    } catch (error) {
      console.error('Error fetching followers', error)
    }
  }

  const handleOpenFollowing = async (userId) => {
    setModalTitle('Following')
    setModalUsers([])
    setModalOpen(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/following/${userId}/`)
      if (response.ok) {
        const data = await response.json()
        setModalUsers(data)
      }
    } catch (error) {
      console.error('Error fetching following', error)
    }
  }

  const handleFollow = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      alert('Please log in to follow users')
      return
    }
    if (!canFollow) return
    if (isTogglingFollow) return

    const targetId = parseInt(id, 10)
    if (Number.isNaN(targetId)) {
      console.error('Cannot follow: account id param is not numeric', { id })
      return
    }

    const actor_id = currentUser.id
    const endpoint = isFollowing ? 'http://127.0.0.1:8000/unfollow/' : 'http://127.0.0.1:8000/follow/'

    const previous = isFollowing
    setIsTogglingFollow(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor_id, target_id: targetId }),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        console.error('Failed to toggle follow', { status: response.status, body: text })
        return
      }

      setIsFollowing(!previous)

      if (typeof refreshProfiles === 'function') {
        await refreshProfiles()
      }
    } catch (err) {
      console.error('Error toggling follow', err)
    } finally {
      setIsTogglingFollow(false)
    }
  }

  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <div>
        {accounts.map((account, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="writer flex flex-col items-center w-full bg-white border border-gray-200 rounded-2xl p-5 sm:p-1 gap-3 hover:border-blue-500 shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="mainContainer flex w-full gap-2 justify-evenly items-center py-3">
              <div className="picContainer h-full flex justify-center items-center">
                <img
                  src={
                    account.profilePic
                      ? account.profilePic.startsWith('http')
                        ? account.profilePic
                        : `http://127.0.0.1:8000${account.profilePic}`
                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.username?.username || 'user'}`
                  }
                  alt={`${account.username?.name}'s avatar`}
                  className="w-28 h-28 md:w-40 md:h-40 xl:w-48 xl:h-48 p-1 object-cover rounded-full border-4 border-blue-500 shadow-2xl bg-white"
                />
              </div>

              <div className="infoContainer flex flex-col justify-center items-start md:items-start gap-1">
                <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">{account.username.name}</h3>
                <span className="text-base text-blue-500 font-medium -mt-2">@{account.username.username}</span>

                <div className="followers md:flex hidden w-full min-w-80 justify-between pr-4 items-center mb-2">
                  <div className="flex gap-6 items-center">
                    <div
                      className="flex flex-col justify-center items-center cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => handleOpenFollowing(account.username.id)}
                    >
                      <span className="text-blue-700 font-semibold text-lg">{account.following || '0'}</span>
                      <span className="font-medium">Following</span>
                    </div>

                    <div
                      className="flex flex-col justify-center items-center cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => handleOpenFollowers(account.username.id)}
                    >
                      <span className="text-blue-700 font-semibold text-lg">{account.followers || '0'}</span>
                      <span className="font-medium">Followers</span>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <span className="text-blue-700 font-semibold text-lg">{account.posts || '0'}</span>
                      <span className="font-medium">Posts</span>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <span className="text-blue-700 font-semibold text-lg">{account.likes || '0'}</span>
                      <span className="font-medium">Likes</span>
                    </div>
                  </div>
                </div>

                <p className="text-start md:flex hidden text-gray-700 text-sm md:text-base line-clamp-3">{account.bio}</p>

                {account.disc && (
                  <div className="w-full md:flex hidden flex-col items-start mt-2">
                    <button
                      onClick={() => setShowAbout(!showAbout)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors focus:outline-none"
                    >
                      {showAbout ? 'Hide About' : 'Read About Me'}
                    </button>
                    {showAbout && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-gray-600 text-sm mt-2 text-start bg-blue-50 p-3 rounded-lg border border-blue-100 w-full"
                      >
                        {account.disc}
                      </motion.div>
                    )}
                  </div>
                )}

                {canFollow ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`mt-3 px-6 py-2 md:flex hidden ${
                      isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
                    } ${isTogglingFollow ? 'opacity-70 cursor-not-allowed' : ''} text-white text-sm md:text-base font-semibold rounded-xl shadow-md transition-all duration-300`}
                    onClick={handleFollow}
                    disabled={!currentUser || isTogglingFollow}
                  >
                    {isTogglingFollow ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 px-6 py-2 md:flex hidden bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-semibold rounded-xl shadow-md transition-all duration-300"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </motion.button>
                )}
              </div>
            </div>

            <div className="md:hidden flex flex-col justify-start mb-3">
              <div className="followers flex justify-evenly items-center mb-2">
                <span
                  className="cursor-pointer hover:opacity-75 transition-opacity flex flex-col justify-center items-center"
                  onClick={() => handleOpenFollowing(account.username.id)}
                >
                  <span className="text-blue-700 font-semibold text-lg">{account.following || '0'}</span>
                  <span className="font-medium">Following</span>
                </span>
                <span
                  className="cursor-pointer hover:opacity-75 transition-opacity flex flex-col justify-center items-center"
                  onClick={() => handleOpenFollowers(account.username.id)}
                >
                  <span className="text-blue-700 font-semibold text-lg">{account.followers || '0'}</span>
                  <span className="font-medium">Followers</span>
                </span>
                <span className="flex flex-col justify-center items-center">
                  <span className="text-blue-700 font-semibold text-lg">{account.posts || '0'}</span>
                  <span className="font-medium">Posts</span>
                </span>
                <span className="flex flex-col justify-center items-center">
                  <span className="text-blue-700 font-semibold text-lg">{account.likes || '0'}</span>
                  <span className="font-medium">Likes</span>
                </span>
              </div>

              <p className="text-center text-gray-700 text-sm md:text-base line-clamp-3">{account.bio}</p>

              {account.disc && (
                <div className="w-full md:hidden flex flex-col items-center mt-2">
                  <button
                    onClick={() => setShowAbout(!showAbout)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors focus:outline-none"
                  >
                    {showAbout ? 'Hide About' : 'Read About Me'}
                  </button>
                  {showAbout && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-gray-600 text-sm mt-2 text-center bg-blue-50 p-3 rounded-lg border border-blue-100 w-full"
                    >
                      {account.disc}
                    </motion.div>
                  )}
                </div>
              )}

              {canFollow ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-3 px-6 py-2 ${
                    isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
                  } ${isTogglingFollow ? 'opacity-70 cursor-not-allowed' : ''} text-white text-sm md:text-base font-semibold rounded-xl shadow-md transition-all duration-300`}
                  onClick={handleFollow}
                  disabled={!currentUser || isTogglingFollow}
                >
                  {isTogglingFollow ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-semibold rounded-xl shadow-md transition-all duration-300"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Posts username={accounts?.[0]?.username?.username ?? id} />
      <Writers category={category} id={id} />

      <FollowModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        users={modalUsers}
      />

      {accounts.length > 0 && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          account={accounts[0]}
          onSuccess={() => {
            if (typeof refreshProfiles === 'function') refreshProfiles();
          }}
        />
      )}
    </>
  )
}

export default Account

