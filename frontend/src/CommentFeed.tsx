import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Comment {
  id: number;
  text: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export default function CommentFeed({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        text,
        created_at,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error.message);
    } else {
      setComments(data || []);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            borderBottom: "1px solid #ccc",
            padding: "10px 0",
            display: "flex",
            gap: "12px",
          }}
        >
          <img
            src={comment.profiles?.avatar_url || "/default-avatar.png"}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <div>
            <strong>{comment.profiles?.username || "Anonymous"}</strong>
            <p style={{ margin: "4px 0" }}>{comment.text}</p>
            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
