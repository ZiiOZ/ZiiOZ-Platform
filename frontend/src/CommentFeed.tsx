import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

interface Comment {
  id: number;
  text: string;
  created_at: string;
  author_id: string;
  profiles?: {
    name: string;
    avatar_url: string;
  };
}

export default function CommentFeed({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  }

  async function handleAIReply(comment: Comment) {
    const res = await fetch("/api/ziibot-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: comment.text })
    });

    const { reply } = await res.json();

    await supabase.from("comments").insert([
      {
        post_id: postId,
        text: reply,
        author_id: "ziibot"
      }
    ]);

    fetchComments();
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mt-4">Comments</h3>
      <ul className="space-y-4 mt-2">
        {comments.map((comment) => (
          <li key={comment.id} className="border-b pb-2">
            <div className="flex items-center space-x-2">
              <img
                src={comment.profiles?.avatar_url || "/default-avatar.png"}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">
                {comment.profiles?.name || comment.author_id}
              </span>
            </div>
            <p className="ml-8 mt-1">{comment.text}</p>
            <button
              onClick={() => handleAIReply(comment)}
              className="ml-8 mt-1 text-sm text-blue-600 hover:underline"
            >
              💬 Reply with ZiiBot
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
