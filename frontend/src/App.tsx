import { useEffect, useState } from "react";

type Post = {
  id: number;
  content: string;
  author: string;
  likes?: number;
};

function App() {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://ziioz-backend.onrender.com/api/posts")
      .then((res) => res.json())
      .then((data) => {
        const withLikes = data.map((post: Post) => ({
          ...post,
          likes: 0,
        }));
        setPosts(withLikes);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("https://ziioz-backend.onrender.com/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, author }),
    });
    const newPost = await response.json();
    setPosts([...posts, { ...newPost, likes: 0 }]);
    setMessage("✅ Post added!");
    setContent("");
    setAuthor("");
  };

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: (post.likes || 0) + 1 } : post
      )
    );
  };

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1>ZiiOZ Creator Dashboard 🌐</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          required
          style={{ padding: 8, marginRight: 10 }}
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post Content"
          required
          style={{ padding: 8, marginRight: 10, width: 300 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Post
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <div>
        <h2>🧠 Total Posts: {posts.length}</h2>

        {posts.length > 0 && (
          <div
            style={{
              background: "#f5f5f5",
              padding: 15,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <h3>🔥 Latest Post</h3>
            <p>
              <strong>{posts[posts.length - 1].author}:</strong>{" "}
              {posts[posts.length - 1].content}
            </p>
          </div>
        )}

        <h3>📜 All Posts</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "10px 0",
              }}
            >
              <strong>{post.author}:</strong> {post.content}{" "}
              <button
                onClick={() => handleLike(post.id)}
                style={{
                  marginLeft: 10,
                  padding: "2px 10px",
                  borderRadius: 4,
                  backgroundColor: "#eee",
                  cursor: "pointer",
                }}
              >
                👍 {post.likes}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
