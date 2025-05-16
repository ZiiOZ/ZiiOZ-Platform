import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Comment {
  id: number;
  text: string;
  created_at: string;
  profile_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export default function CommentFeed({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();

    // ✅ Enable real-time updates
    const channel = supabase
      .channel("realtime-comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          const newComment = payload.new as Comment;
          setComments((prev) => [...prev, newComment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        text,
        created_at,
        profile_id,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error.message);
    } else {
      setComments(data || []);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start gap-3 border-b border-gray-200 py-4"
        >
          <img
            src={comment.profiles?.avatar_url || "/default-avatar.png"}
            alt="avatar
