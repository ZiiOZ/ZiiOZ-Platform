// frontend/src/App.tsx
import { useEffect, useState } from 'react';
import CommentBox from './components/CommentBox';

// Dummy posts for now – soon we’ll pull from Supabase
const initialPosts = [
  { id: 1, content: 'Welcome to ZiiOZ 🎉', author: 'Westley' },
  { id: 2, content: 'Big things coming soon...', author: 'Tillie' },
  { id: 3, content: 'Built for creators. Powered by community.', author: 'Maddie' }
];

type Post = {
  id: number;
  content: string;
  author: string;
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // You’ll swap this with Supabase post fetch later
    setPosts(initialPosts);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>ZiiOZ 🚀</h1>
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <h3>{post.author}</h3>
          <p>{post.content}</p>
          <CommentBox postId={post.id} />
        </div>
      ))}
    </div>
  );
}
