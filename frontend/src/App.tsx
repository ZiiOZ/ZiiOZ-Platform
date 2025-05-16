import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import CommentForm from "./CommentForm";
import CommentFeed from "./CommentFeed";

type Post = {
  id: number;
  content: string;
  author: string;
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, author")
        .order("id", { ascending: false });

      if (data) {
        setPosts(data);
      } else {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>ZiiOZ 🚀</h1>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "2rem",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ margin: "0 0 0.5rem" }}>{post.author}</h2>
          <p style={{ marginBottom: "1rem" }}>{post.content}</p>
          <CommentForm postId={post.id.toString()} />
          <CommentFeed postId={post.id.toString()} />
        </div>
      ))}
    </div>
  );
}
