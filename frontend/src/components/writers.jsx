import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { userContext } from '../Context/userContext';
import { profileContext } from '../Context/profileContext';


const Writers = ({ category, id, searchText }) => {
  const { Profiles, Loading } = useContext(profileContext);
  const { currentUser } = useContext(userContext);
  console.log(Profiles)
  const [FilterWriters, setFilterWriters] = useState([]);
  const [Items, setItems] = useState(8);

  useEffect(() => {
    const allProfiles = Array.isArray(Profiles) ? Profiles : [];
    let filtered = [...allProfiles];

    if (category) {
      filtered = filtered.filter(
        (writer) => writer.category === category && writer.username?.id !== Number(id)
      );
    }

    if (searchText) {
      filtered = filtered.filter((writer) =>
        (writer.username?.name || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (currentUser) {
      filtered = filtered.filter((writer) => writer.username?.id !== currentUser.id);
    }

    setFilterWriters(filtered);
  }, [category, id, searchText, Profiles, currentUser]);

  useEffect(() => {
    const changeItemCount = () => {
      if (window.innerWidth < 840) setItems(4);
      else setItems(8);
    };

    changeItemCount();
    window.addEventListener('resize', changeItemCount);

    return () => window.removeEventListener('resize', changeItemCount);
  }, []);

  return (
    <div className="userData flex justify-center items-center flex-col gap-2 mt-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4">
        {category || searchText ? 'Related' : 'Top'} <span className="text-blue-600">Writers</span>
      </h1>

      <div className="container flex flex-wrap justify-center gap-1 sm:gap-2 3xl:gap-4 mt-10">
        {Loading ? (
          <span className="font-semibold text-gray-500">Loading...</span>
        ) : FilterWriters.length >= 1 ? (
          FilterWriters.slice(0, Items).map((writer, index) => (
            <WritersCard writer={writer} key={index} />
          ))
        ) : (
          <span className="font-semibold text-red-700">No Writer Available to Show</span>
        )}
      </div>
    </div>
  );
};

export const WritersCard = ({ writer }) => {
  const { currentUser } = useContext(userContext);
  const { refreshProfiles, optimisticFollowUpdate } = useContext(profileContext);


  const [isFollowing, setIsFollowing] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const navigate = useNavigate();


  // Set initial follow state once (so after refresh it shows correct value),
  // but DO NOT reset it on every re-render/click.
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!currentUser || !writer.username?.id) return;
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/check_follow_status/?actor_id=${currentUser.id}&target_id=${writer.username.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(!!data.is_following);
        }
      } catch (err) {
        console.error('Error fetching follow status', err);
      }
    };

    fetchFollowStatus();
  }, [currentUser, writer.username?.id]);


  const handleCardClick = () => {
    navigate(`/account/${writer.username?.id}/${writer.username?.username}`);
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      alert('Please log in to follow other users!');
      return;
    }
    if (isTogglingFollow) return;

    const actor_id = currentUser.id;
    const targetId = writer.username?.id;
    if (!targetId) return;

    const previous = isFollowing;
    const endpoint = isFollowing
      ? 'http://127.0.0.1:8000/unfollow/'
      : 'http://127.0.0.1:8000/follow/';

    setIsTogglingFollow(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor_id,
          target_id: targetId,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error('Failed to toggle follow', { status: response.status, body: text });
        return;
      }

      // Only update UI after success
      setIsFollowing(!previous);

      // Ensure follower/following counts update in related lists too
      if (typeof refreshProfiles === 'function') {
        await refreshProfiles();
      }
    } catch (err) {
      console.error('Error toggling follow', err);
    } finally {
      setIsTogglingFollow(false);
    }
  };

  return (
      <motion.div
        onClick={handleCardClick}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="writer flex flex-col items-center
          w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)] max-w-[280px]
          bg-white border border-gray-200 rounded-xl sm:rounded-2xl
          p-3 sm:p-5 gap-2 sm:gap-3
          hover:border-blue-500 shadow-md sm:shadow-2xl transition-all duration-300 cursor-pointer"
      >
        <img
          src={
            writer.profilePic
              ? writer.profilePic.startsWith('http')
                ? writer.profilePic
                : `http://127.0.0.1:8000${writer.profilePic}`
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${writer.username?.username || 'user'}`
          }
          alt={`${writer.username?.name}'s avatar`}
          className="w-14 h-14 sm:w-20 sm:h-20 p-0.5 sm:p-1 object-cover rounded-full border-4 border-blue-500 shadow-lg bg-white"
        />

        <h3 className="text-base sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors text-center">
          {writer.username?.name}
        </h3>

        <span className="text-xs sm:text-sm text-blue-500 font-medium -mt-2 sm:-mt-3">
          @{writer.username?.username}
        </span>

        <p className="text-center text-gray-700 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
          {writer.bio}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFollow}
          disabled={isTogglingFollow}
          className={`mt-1 sm:mt-2 px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-md transition-all duration-300
            ${isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}
            ${isTogglingFollow ? 'opacity-70 cursor-not-allowed' : ''}
            text-white`}
        >
          {isTogglingFollow ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
        </motion.button>
      </motion.div>
  );
};

export default Writers;
