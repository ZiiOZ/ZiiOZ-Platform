
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

interface Comment {
  id: number;
  name: string;
  text: string;
  created_at: string;
}

export default function CommentBox({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("comments").insert([
      { name, text, post_id: postId },
    ]);

    setLoading(false);
    if (error) console.error("Error saving comment:", error);
    else {
      setText("");
      fetchComments();
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-lg p-4 rounded-xl">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Your name"
          className="flex-1 px-2 py-1 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-2 px-2 py-1 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      <div>
        {comments.map((c) => (
          <div key={c.id} className="mb-2 border-b pb-1 text-sm">
            <strong>{c.name}</strong>: {c.text}
            <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
