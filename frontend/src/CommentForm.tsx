// frontend/src/CommentForm.tsx
import { useState } from "react";
import { supabase } from "./lib/supabaseClient"; // ✅ correct

export default function CommentForm({ postId }: { postId: string }) {
  const [text, setText] = useState("");
  const [profileId, setProfileId] = useState(""); // Set your UUID or fetch from user session
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.from("comments").insert([
      {
        post_id: Number(postId),
        profile_id: profileId,
        text: text.trim(),
      },
    ]);

    if (error) {
      console.error("Failed to submit comment:", error);
      setErrorMsg("Submission failed. Check console for details.");
    } else {
      setText("");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Your Profile ID (UUID)"
        value={profileId}
        onChange={(e) => setProfileId(e.target.value)}
        className="w-full p-2 mt-2 border rounded"
        required
      />
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
