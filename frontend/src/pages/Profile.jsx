import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

import { userContext } from '../Context/userContext'
import { profileContext } from '../Context/profileContext'

const API_BASE = 'http://127.0.0.1:8000'

const categoryOptions = [
  'Technology',
  'Business & Finance',
  'Education & Learning',
  'Health & Wellness',
  'Lifestyle',
  'Food & Recipes',
  'Travel',
  'Entertainment',
  'Fashion & Beauty',
  'Creative Arts',
  'Science & Knowledge',
  'Sports & Fitness',
  'Environment & Social',
]

const Profile = () => {
  const { currentUser } = useContext(userContext)
  const { Profiles, refreshProfiles } = useContext(profileContext)
  const { id } = useParams()

  const targetUserId = useMemo(() => {
    const n = Number(id)
    return Number.isNaN(n) ? null : n
  }, [id])

  const myProfile = useMemo(() => {
    if (!currentUser || !targetUserId) return null
    if (currentUser.id !== targetUserId) return null
    return Array.isArray(Profiles)
      ? Profiles.find((p) => Number(p?.username?.id) === currentUser.id) || null
      : null
  }, [Profiles, currentUser, targetUserId])

  const [form, setForm] = useState({
    bio: '',
    disc: '',
    category: 'Technology',
    profilePic: null,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!myProfile) return
    setForm({
      bio: myProfile.bio || '',
      disc: myProfile.disc || '',
      category: myProfile.category || 'Technology',
      profilePic: null,
    })
    setSaveError('')
    setSaveSuccess(false)
  }, [myProfile])

  const avatarUrl = useMemo(() => {
    if (!myProfile?.profilePic) return ''
    if (myProfile.profilePic.startsWith('http')) return myProfile.profilePic
    return `${API_BASE}${myProfile.profilePic}`
  }, [myProfile])

  const canEdit = !!currentUser && !!myProfile

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setForm((prev) => ({ ...prev, profilePic: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canEdit || !targetUserId) return

    setIsSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      const payload = new FormData()
      payload.append('bio', form.bio)
      payload.append('disc', form.disc)
      payload.append('category', form.category)
      if (form.profilePic) payload.append('profilePic', form.profilePic)

      const response = await axios.put(
        `${API_BASE}/update_profile/${targetUserId}/`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: false,
        }
      )

      if (response.status >= 200 && response.status < 300) {
        if (typeof refreshProfiles === 'function') {
          await refreshProfiles()
        }
        setSaveSuccess(true)
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to save profile'
      setSaveError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="text-gray-600 font-semibold">Please log in to view/edit your profile.</span>
      </div>
    )
  }

  if (!myProfile) {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="text-gray-600 font-semibold">You can only edit your own profile.</span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Edit Profile</h1>

      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username || 'user'}`
            }
            alt="profile"
            className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover bg-white"
          />
          <div>
            <div className="text-xl font-bold text-gray-900">{currentUser.name}</div>
            <div className="text-blue-600 font-semibold">@{currentUser.username}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              disabled={isSaving}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Bio</label>
            <input
              name="bio"
              value={form.bio}
              onChange={onChange}
              maxLength={150}
              className="w-full border border-gray-300 rounded-xl px-3 py-2"
              disabled={isSaving}
              placeholder="Short bio"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              name="disc"
              value={form.disc}
              onChange={onChange}
              maxLength={500}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 min-h-[120px]"
              disabled={isSaving}
              placeholder="Tell us about yourself"
            />
          </div>

          {saveError ? <div className="text-red-600 font-semibold">{saveError}</div> : null}
          {saveSuccess ? <div className="text-green-700 font-semibold">Saved successfully.</div> : null}

          <motion.button
            whileHover={{ scale: isSaving ? 1 : 1.02 }}
            whileTap={{ scale: isSaving ? 1 : 0.98 }}
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold rounded-xl px-6 py-3 shadow-md transition-all"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export default Profile

