import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FollowModal = ({ isOpen, onClose, title, users }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition-colors text-2xl font-semibold leading-none"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto pr-2 flex-grow">
              {users && users.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {users.map((profile, index) => (
                    <Link
                      key={index}
                      to={`/account/${profile.username?.id}/${profile.username?.username}`}
                      className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      onClick={onClose}
                    >
                      <img
                        src={
                          profile.profilePic
                            ? (profile.profilePic.startsWith('http') ? profile.profilePic : `http://127.0.0.1:8000${profile.profilePic}`)
                            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username?.username || 'user'}`
                        }
                        alt={`${profile.username?.name}'s avatar`}
                        className="w-12 h-12 object-cover rounded-full border-2 border-blue-500"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{profile.username?.name}</span>
                        <span className="text-sm text-gray-500">@{profile.username?.username}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No users found.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowModal;
