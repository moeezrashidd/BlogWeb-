import React, { useState } from "react";
import {categories} from "../Context/data"
const AddPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Technology",
    image: null,
    imagePreview: null,
  });



  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();
    const newPost = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      image: formData.image,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    console.log("New Post:", newPost);

    // Reset form
    setFormData({
      title: "",
      content: "",
      category: "Technology",
      image: null,
      imagePreview: null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:w-screen">
      <h1 className="text-3xl xl:text-5xl font-extrabold text-center text-gray-900 mb-8">
        Add a <span className="text-blue-600">New Post ✍️</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full rounded-2xl p-8 space-y-8 border-2 border-gray-200 shadow-xl hover:border-blue-600"
      >
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Post Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Post Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            placeholder="Write your post here..."
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4  py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2  focus:ring-blue-200 outline-none transition"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Cover Image
          </label>
          <div className="flex items-center gap-6">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-200"
              />
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all"
          >
            🚀 Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
