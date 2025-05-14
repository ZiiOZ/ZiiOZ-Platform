import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import CommentBox from './CommentBox';

type Post = {
  id: number;
  content: string;
  author: string;
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, content, author')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data || []);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>ZiiOZ 🚀</h1>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <h3>{post.author}</h3>
          <p>{post.content}</p>
          <CommentBox postId={post.id} />
        </div>
      ))}
    </div>
  );
}
