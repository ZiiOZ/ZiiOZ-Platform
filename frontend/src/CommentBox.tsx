// frontend/src/components/CommentBox.tsx
import { useState, useEffect } from 'react';
import { supabase } from "./lib/supabaseClient";

type Comment = {
  id: number;
  post_id: number;
  author: string;
  text: string;
  created_at: string;
};

type Props = {
  postId: number;
};

export default function CommentBox({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setComments(data as Comment[]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, author, text }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Submit error:', error.message);
    } else {
      setComments([...comments, data as Comment]);
      setText('');
      setAuthor('');
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h4>💬 Comments</h4>
      <form onSubmit={handleSubmit} style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          required
          style={{ padding: 6, marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          required
          style={{ padding: 6, width: 250 }}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: 10, padding: '6px 12px' }}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map(comment => (
          <li key={comment.id} style={{ borderBottom: '1px solid #eee', padding: 6 }}>
            <strong>{comment.author}</strong>: {comment.text} <br />
            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
