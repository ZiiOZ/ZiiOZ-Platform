
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { handleAIReply } from "../utils/ziibot-reply";

interface Comment {
  id: number;
  name: string;
  text: string;
  created_at: string;
  boost_count: number;
}

export default function CommentFeed({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error loading comments:", error);
    else setComments(data || []);
  }

  async function handleBoost(commentId: number) {
    await supabase.rpc("increment_boost_count", { comment_id_input: commentId });
    fetchComments();
  }

  async function handleAIResponse(originalText: string, commentId: number) {
    const aiText = await handleAIReply(originalText);
    await supabase.from("comments").insert([
      {
        name: "ZiiBot 🤖",
        text: aiText,
        post_id: postId,
      },
    ]);
    fetchComments();
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-2">
          <div className="font-semibold">{comment.name}</div>
          <div className="text-sm mb-1">{comment.text}</div>
          <div className="text-xs text-gray-500 mb-1">
            {new Date(comment.created_at).toLocaleString()}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleBoost(comment.id)}
              className="text-blue-500 hover:underline text-xs"
            >
              🚀 Boost ({comment.boost_count || 0})
            </button>
            <button
              onClick={() => handleAIResponse(comment.text, comment.id)}
              className="text-green-500 hover:underline text-xs"
            >
              🤖 Ask ZiiBot
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
