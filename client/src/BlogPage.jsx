import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5002/api/blog/${id}`).then(res => setBlog(res.data));
  }, [id]);

  if (!blog) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{blog.title}</h2>
      <p>by {blog.author}</p>
      <div>{blog.content}</div>
    </div>
  );
}

export default BlogPage;