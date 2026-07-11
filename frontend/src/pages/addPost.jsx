import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../Context/data";
import TextEditor from "../components/TextEditor";
import { postContext } from "../Context/postsContext";
import { userContext } from "../Context/userContext";
import API_BASE_URL from "../config";

const AddPost = () => {
  const { id } = useParams();           // present only on /editPost/:id
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const { postData, setPostData } = useContext(postContext);
  const { currentUser } = useContext(userContext);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Technology",
    images: [],
    imagePreviews: [],
    existingImages: [],
  });

  const [loading, setLoading] = useState(isEditMode);
  // contentLoaded flips true once we have the post content — used to key the editor
  const [contentLoaded, setContentLoaded] = useState(false);

  /* ──────────────────────────────────────────
     In Edit Mode: fetch existing post details
  ────────────────────────────────────────── */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchPost = async () => {
      try {
        // Try local context cache first for speed
        let post = postData.find((p) => p.id === parseInt(id));

        // Always fetch from API to get the absolute latest
        const res = await fetch(`${API_BASE_URL}/posts/${id}/`);
        if (res.ok) post = await res.json();

        if (!post) {
          alert("Post not found.");
          navigate("/");
          return;
        }

        // Verify ownership
        const authorId = post.author?.id ?? post.username;
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        if (loggedInUserId && parseInt(loggedInUserId) !== parseInt(authorId)) {
          alert("You are not authorised to edit this post.");
          navigate("/");
          return;
        }

        setFormData({
          title: post.title,
          content: post.content,
          category: post.category || "Technology",
          images: [],
          imagePreviews: [],
          existingImages: post.images || [],
        });
        setContentLoaded(true);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ──────────────────────────────────────────
     Handlers
  ────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const selected = Array.from(files);
      const previews = selected.map((f) => URL.createObjectURL(f));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...selected],
        imagePreviews: [...prev.imagePreviews, ...previews],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (content) =>
    setFormData((prev) => ({ ...prev, content }));

  const removeImage = (index) => {
    const imgs = [...formData.images];
    const prevs = [...formData.imagePreviews];
    imgs.splice(index, 1);
    prevs.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: imgs, imagePreviews: prevs }));
  };

  /* ──────────────────────────────────────────
     Submit: create OR update
  ────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("loggedInUserId");
    if (!userId) {
      alert("You must be logged in.");
      return;
    }

    const data = new FormData();
    if (!isEditMode) data.append("username", userId);
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    formData.images.forEach((file) => data.append("images", file));

    const url = isEditMode
      ? `${API_BASE_URL}/posts/${id}/`
      : `${API_BASE_URL}/posts/`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, body: data });

      if (response.ok) {
        const result = await response.json();

        if (isEditMode) {
          // Replace the updated post in global context
          if (setPostData) {
            setPostData((prev) =>
              prev.map((p) => (p.id === parseInt(id) ? result : p))
            );
          }
          alert("Post updated successfully!");
          navigate(`/post/${id}/${encodeURIComponent(formData.title)}`);
        } else {
          // Add new post to context list
          if (setPostData) {
            setPostData((prev) => [result, ...prev]);
          }
          // Reset form for a new post
          setFormData({
            title: "",
            content: "",
            category: "Technology",
            images: [],
            imagePreviews: [],
            existingImages: [],
          });
          alert("Post published successfully!");
        }
      } else {
        const err = await response.json();
        console.error("API error:", err);
        alert(isEditMode ? "Failed to update post." : "Failed to publish post.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Helper: resolve existing image URLs
  const getImgUrl = (imgObj) => {
    const src = imgObj?.image;
    if (!src) return "";
    return src.startsWith("http") ? src : `${API_BASE_URL}${src}`;
  };

  /* ──────────────────────────────────────────
     Render
  ────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Loading post…
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl xl:text-5xl font-extrabold text-center text-gray-900 mb-8">
        {isEditMode ? (
          <>
            Edit <span className="text-blue-600">Post ✏️</span>
          </>
        ) : (
          <>
            Add a <span className="text-blue-600">New Post ✍️</span>
          </>
        )}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full rounded-2xl p-8 space-y-8 border-2 border-gray-200 shadow-xl hover:border-blue-600 transition-colors"
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
          {/* key forces full re-mount once edit content has loaded so Lexical
              picks up initialContent instead of starting blank */}
          <TextEditor
            key={isEditMode ? `edit-${id}-${contentLoaded}` : 'new'}
            initialContent={isEditMode && contentLoaded ? formData.content : undefined}
            value={formData.content}
            onChange={handleContentChange}
          />
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Current images (edit mode only) */}
        {isEditMode && formData.existingImages.length > 0 && (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Current Images
            </label>
            <div className="flex flex-wrap gap-4">
              {formData.existingImages.map((imgObj, idx) => (
                <img
                  key={idx}
                  src={getImgUrl(imgObj)}
                  alt="Existing"
                  className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-200"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Uploading new images below will replace the current ones.
            </p>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            {isEditMode ? "Upload New Images (Optional)" : "Upload Images"}
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

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {isEditMode && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all active:scale-95"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all"
          >
            {isEditMode ? "Update Post" : " Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
