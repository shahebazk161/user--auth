import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    setEmail(userEmail);

    axios.get("http://localhost:5002/api/blog")
      .then(res => setBlogs(res.data))
      .catch(() => setBlogs([]));
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h1>Mini Medium Clone</h1>
      {email && <p>Welcome, <b>{email}</b>!</p>}
      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/write")}
      >
        Write Blog
      </button>
      <button
        className="btn btn-danger mb-3 ms-2"
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
      <hr />
      <h2>All Blogs</h2>
      {blogs.length === 0 && <p>No blogs found.</p>}
      <ul>
        {blogs.map(blog => (
          <li key={blog._id}>
            <b>{blog.title}</b> by {blog.author}
            <button
              className="btn btn-link"
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              Read
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;