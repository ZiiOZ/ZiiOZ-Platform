// components/CommentForm.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CommentForm({ postId, profileId }: { postId: string; profileId: string }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('comments').insert([
      { text, post_id: postId, profile_id: profileId },
    ]);
    setLoading(false);
    if (!error) setText('');
    else alert('Error submitting comment: ' + error.message);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Leave a comment..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? '...' : 'Post'}
      </button>
    </form>
  );
}
