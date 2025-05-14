// src/App.tsx
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://ziioz-backend.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, author }),
      });

      if (!res.ok) throw new Error('Failed to post');

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      setContent('');
      setAuthor('');
    } catch (error) {
      setResponse('Error: ' + error);
    }
  };

  return (
    <div className="app">
      <h1 className="title">ZiiOZ Content Submission 🚀</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name (e.g. Westley)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Submit to ZiiOZ</button>
      </form>
      {response && (
        <div className="response">
          <strong>Server Response:</strong>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
