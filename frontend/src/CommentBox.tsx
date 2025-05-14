// frontend/src/components/CommentBox.tsx
import { useState, useEffect } from 'react';

type Comment = {
  id: number;
  postId: number;
  text: string;
  author: string;
};

type Props = {
  postId: number;
};

export default function CommentBox({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetch(`https://ziioz-backend.onrender.com/api/comments?postId=${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('https://ziioz-backend.onrender.com/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId, text, author })
    });
    const newComment = await res.json();
    setComments([...comments, newComment]);
    setText('');
    setAuthor('');
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
        <button type="submit" style={{ marginLeft: 10, padding: '6px 12px' }}>
          Send
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map(comment => (
          <li key={comment.id} style={{ borderBottom: '1px solid #eee', padding: 6 }}>
            <strong>{comment.author}</strong>: {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
