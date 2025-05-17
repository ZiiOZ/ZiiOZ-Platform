// frontend/src/CommentFeed.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Comment {
  id: number;
  created_at: string;
  post_id: number;
  profile_id: string;
  text: string;
}

const CommentFeed: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', 1) // 🔥 important for filtering per post
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        console.log('Fetched comments:', data);
        setComments(data || []);
      }
    };

    fetchComments();
  }, []);

  return (
    <div>
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.text}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentFeed;
