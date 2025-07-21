import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { toast, ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "./Write.css";

function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  // Auto-save to localStorage
  useEffect(() => {
    const savedTitle = localStorage.getItem("draft_title");
    const savedContent = localStorage.getItem("draft_content");
    const savedImage = localStorage.getItem("draft_image");
    const savedTags = localStorage.getItem("draft_tags");
    if (savedTitle) setTitle(savedTitle);
    if (savedContent) setContent(savedContent);
    if (savedImage) setImage(savedImage);
    if (savedTags) setTags(savedTags);
  }, []);

  useEffect(() => {
    localStorage.setItem("draft_title", title);
    localStorage.setItem("draft_content", content);
    localStorage.setItem("draft_image", image);
    localStorage.setItem("draft_tags", tags);
  }, [title, content, image, tags]);

  const postBlog = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter both Title and Content!");
      return;
    }

    const author = localStorage.getItem("email") || "Admin";
    try {
      await axios.post("http://localhost:5002/api/blog", {
        title,
        content,
        author,
        image,
        tags: tags.split(",").map(tag => tag.trim()),
      });
      toast.success("Blog posted successfully!");
      localStorage.removeItem("draft_title");
      localStorage.removeItem("draft_content");
      localStorage.removeItem("draft_image");
      localStorage.removeItem("draft_tags");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="write-container">
      <ToastContainer />
      <div className="write-box">
        <h2 className="write-heading">📝 Write a New Blog</h2>

        <input
          className="form-input"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="form-input"
          placeholder="Cover Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <input
          className="form-input"
          placeholder="Tags (comma separated, e.g. tech,react,life)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Write your blog content here..."
          className="quill-editor"
        />

        <p className="word-count">
          🧮 Word Count: {content.trim().split(/\s+/).filter(Boolean).length}
        </p>

        <button className="submit-btn" onClick={postBlog}>
          🚀 Post Blog
        </button>

        <div className="preview-section">
          <h3>📌 Live Preview</h3>
          <div className="preview-box">
            {image && <img src={image} alt="cover" className="preview-img" />}
            <h4>{title || "Your Blog Title"}</h4>
            <div dangerouslySetInnerHTML={{ __html: content }} />
            {tags && (
              <p>
                <b>Tags:</b> {tags}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Write;
