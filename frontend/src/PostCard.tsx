import CommentForm from './CommentForm';
import CommentList from './CommentList';

export default function PostCard({ post, profileId }) {
  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="text-lg font-bold">{post.title}</h3>
      <p className="mb-2">{post.content}</p>

      <CommentList postId={post.id} />
      <CommentForm postId={post.id} profileId={profileId} />
    </div>
  );
}
