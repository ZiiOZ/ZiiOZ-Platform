import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

interface Comment {
  id: number;
  text: string;
  created_at: string;
  profile_id: string;
}

export default function CommentFeed() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, text, created_at, profile_id")
        .eq("post_id", 1)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        console.log("Fetched comments:", data); // Debug line
        setComments(data || []);
      }

      setLoading(false);
    };

    fetchComments();
  }, []);

  return (
    <div>
      <h3>Comments</h3>
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.text}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
