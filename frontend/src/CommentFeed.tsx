import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

type Comment = {
  id: number;
  text: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

export default function CommentFeed() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, text, created_at, profiles (username, avatar_url)")
        .eq("post_id", 1)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching comments:", error);
      } else {
        setComments(data || []);
      }

      setLoading(false);
    };

    fetchComments();
  }, []);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Comments</h3>
      {loading ? (
        <p>Loading...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={comment.profiles?.avatar_url || "/default-avatar.png"}
                  alt="avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "0.75rem",
                  }}
                />
                <
