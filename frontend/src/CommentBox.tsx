// 🔄 Triggered deployment commit: Render successfully showing frontend 🚀
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Comment {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

export default function CommentBox() {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error.message);
    } else {
      setComments(data || []);
    }
  };

  const handleSubmit = async () => {
    if (!author.trim() || !content.trim()) {
      alert('Please enter both name and comment.');
      return;
    }

    const { error } = await supabase.from('comments').insert([
      {
        post_id: 1,
        author,
        content,
      },
    ]);

    if (error) {
      console.error('Error submitting comment:', error.message);
      alert('Failed to submit comment.');
    } else {
      setAuthor('');
      setContent('');
      fetchComments();
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
      <h3>🚀 Comments</h3>
      <input
        type="text"
        placeholder="Your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <input
        type="text"
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ marginRight: '0.5rem', width: '50%' }}
      />
      <button onClick={handleSubmit}>Send</button>

      <ul style={{ marginTop: '1rem', paddingLeft: 0 }}>
        {comments.map((comment) => (
          <li key={comment.id} style={{ listStyle: 'none', marginBottom: '0.75rem' }}>
            <strong>{comment.author}:</strong> {comment.content}
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              {new Date(comment.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
