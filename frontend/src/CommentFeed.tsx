import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

interface Comment {
  id: number;
  text: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

export default function CommentFeed({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("id, text, created_at, profiles(full_name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching comments:", error);
    else setComments(data);
  }

  function handleBoost(commentId: number) {
    console.log(`Boosted comment ${commentId}`);
    // Visual feedback or token logic can go here later
  }

  return (
    <div className="mt-6 space-y-6 px-4 md:px-8">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start space-x-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:space-x-5"
        >
          <img
            src={comment.profiles?.avatar_url || "/default-avatar.png"}
            alt="avatar"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm md:text-base font-semibold text-gray-900">
              {comment.profiles?.full_name || "Anonymous"}
            </p>
            <p className="text-sm md:text-base text-gray-800 mt-1 whitespace-pre-line">
              {comment.text}
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              {new Date(comment.created_at).toLocaleString()}
            </p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleBoost(comment.id)}
                className="text-xs text-yellow-600 hover:underline"
              >
                ⚡ Boost
              </button>
              <button
                onClick={() => console.log(`AI reply requested for comment ${comment.id}`)}
                className="text-xs text-blue-600 hover:underline"
              >
                💬 Reply with ZiiBot
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
