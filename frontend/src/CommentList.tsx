// components/CommentList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, text, created_at, profile:profiles(username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (!error) setComments(data || []);
    else console.error('Error loading comments:', error.message);
  };

  return (
    <div className="mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="mb-3 border-b pb-2">
          <div className="flex items-center gap-2">
            <img src={comment.profile?.avatar_url} alt="" className="w-6 h-6 rounded-full" />
            <span className="text-sm font-semibold">{comment.profile?.username}</span>
          </div>
          <p className="text-sm mt-1">{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
