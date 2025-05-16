import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [text, setText] = useState("");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !session?.user) return;

    setLoading(true);

    const { error } = await supabase.from("comments").insert([
      {
        text,
        post_id: postId,
        profile_id: session.user.id,
      },
    ]);

    if (error) {
      console.error("Error posting comment:", error.message);
    } else {
      setText("");
    }

    setLoading(false);
  };

  if (!session) {
    return (
      <p style={{ color: "#888", fontStyle: "italic", marginBottom: "1rem" }}>
        Please log in to leave a comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <textarea
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        style={{ width: "100%", resize: "none", padding: "8px" }}
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        style={{
          marginTop: "8px",
          padding: "6px 12px",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
