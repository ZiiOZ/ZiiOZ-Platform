import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Comment {
  id: number;
  created_at: string;
  post_id: number;
  profile_id: string;
  text: string;
}

export default function CommentFeed() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", 1) // only fetch comments for post 1
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        console.log("Fetched comments:", data);
        setComments(data);
      }
    };

    fetchComments();
  }, []);

  return (
    <div>
      <h3 className="font-semibold text-lg">Comments</h3>
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 mt-2">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-100 p-2 rounded">
              <span className="text-sm">{comment.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
