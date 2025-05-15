import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient'

export default function CommentBox() {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    // Initial fetch of existing comments
    fetchComments();

    // Realtime listener for new comments
    const channel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          setComments((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  };

  const handleSubmit = async () => {
    if (!name || !text) return;

    const { error } = await supabase.from('comments').insert([
      {
        author: name,
        content: text,
      },
    ]);

    if (!error) {
      setText('');
    }
  };

  return (
    <div>
      <h3>💬 Comments</h3>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ marginRight: '10px', width: '300px' }}
      />
      <button onClick={handleSubmit}>Send</button>

      <div style={{ marginTop: '20px' }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ marginBottom: '10px' }}>
            <strong>{comment.author}:</strong> {comment.content}
            <br />
            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
