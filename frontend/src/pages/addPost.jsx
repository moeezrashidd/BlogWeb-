import React, { useState } from "react";
import { categories } from "../Context/data";
import TextEditor from "../components/TextEditor";
const AddPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Technology",
    images: [],
    imagePreviews: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const selectedFiles = Array.from(files);
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setFormData({
        ...formData,
        images: [...formData.images, ...selectedFiles],
        imagePreviews: [...formData.imagePreviews, ...previews],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...formData.imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
      imagePreviews: newPreviews,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("loggedInUserId");
    if (!userId) {
      alert("You must be logged in to create a post.");
      return;
    }

    const data = new FormData();
    data.append("username", userId);
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);

    formData.images.forEach((file) => {
      data.append("images", file);
    });

    try {
      const response = await fetch("https://moeezrashidd.pythonanywhere.com/posts/", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const newPost = await response.json();
        console.log("Post created successfully:", newPost);
        
        // Reset form
        setFormData({
          title: "",
          content: "",
          category: "Technology",
          images: [],
          imagePreviews: [],
        });
        alert("Post published successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to create post", errorData);
        alert("Failed to publish post.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while publishing.");
    }
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
          <TextEditor value={formData.content} onChange={handleContentChange} />
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
            Upload Images
          </label>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
            {formData.imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-2">
                {formData.imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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
