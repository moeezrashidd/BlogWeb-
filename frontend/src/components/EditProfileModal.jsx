import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryOpts = [
  "Technology",
  "Business & Finance",
  "Education & Learning",
  "Health & Wellness",
  "Lifestyle",
  "Food & Recipes",
  "Travel",
  "Entertainment",
  "Fashion & Beauty",
  "Creative Arts",
  "Science & Knowledge",
  "Sports & Fitness",
  "Environment & Social"
];

const EditProfileModal = ({ isOpen, onClose, account, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    disc: '',
    category: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (account && isOpen) {
      setFormData({
        name: account.username?.name || '',
        bio: account.bio || '',
        disc: account.disc || '',
        category: account.category || ''
      });
      setProfilePic(null);
      setError(null);
    }
  }, [account, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    data.append('disc', formData.disc);
    data.append('category', formData.category);
    if (profilePic) {
      data.append('profilePic', profilePic);
    }

    try {
      const response = await fetch(`https://moeezrashidd.pythonanywhere.com/update_profile/${account.username.id}/`, {
        method: 'PUT',
        body: data,
        // Don't set Content-Type header manually when sending FormData, fetch will set it with boundary
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errData = await response.json();
        console.error("Error updating profile:", errData);
        setError("Failed to update profile. Please check the inputs.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="" disabled>Select a category</option>
                  {categoryOpts.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={2}
                  maxLength={150}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                />
                <p className="text-xs text-gray-500 text-right mt-1">{formData.bio.length}/150</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Me (Description)</label>
                <textarea
                  name="disc"
                  value={formData.disc}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                />
                <p className="text-xs text-gray-500 text-right mt-1">{formData.disc.length}/500</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                />
              </div>

            </form>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-700 transition-all shadow-md disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
