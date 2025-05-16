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
        setComments(data || []);
      }

      setLoading(false);
    };

    fetchComments();
  }, []);

  if (loading) return <p>Loading comments...</p>;

  return (
    <div>
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
