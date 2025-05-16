import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [text, setText] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);

  // ✅ Get logged-in user's profile ID
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        setProfileId(user.id); // This assumes your profile table uses user.id (UUID) as the primary key
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !profileId) return;

    const { error } = await supabase.from("comments").insert([
      {
        text,
        post_id: postId,
        profile_id: profileId,
      },
    ]);

    if (error) {
      console.error("Error posting comment:", error.message);
    } else {
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button type="submit" disabled={!profileId}>
        Post Comment
      </button>
    </form>
  );
}
