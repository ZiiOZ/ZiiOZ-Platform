// frontend/src/App.tsx
import { useEffect, useState } from "react";

type Post = {
  id: number;
  content: string;
  author: string;
};

function App() {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");

  // Fetch posts from backend
  useEffect(() => {
    fetch("https://ziioz-backend.onrender.com/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  // Submit post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("https://ziioz-backend.onrender.com/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, author }),
    });
    const data = await response.json();
    setMessage("✅ Post submitted successfully!");
    setPosts([...posts, data]);
    setContent("");
    setAuthor("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>ZiiOZ ✨ Post Portal</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          type="text"
          placeholder="Your post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ marginRight: 10, padding: 5, width: 300 }}
        />
        <button type="submit" style={{ padding: "5px 15px" }}>Post</button>
      </form>

      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}

      <hr style={{ margin: "20px 0" }} />
      <h2>🔥 Live Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.author}:</strong> {post.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
