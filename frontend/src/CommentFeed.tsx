import CommentBox from "./CommentBox";
import CommentForm from "./CommentForm";

interface CommentFeedProps {
  postId: string;
}

export default function CommentFeed({ postId }: CommentFeedProps) {
  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4">Discussion</h1>
      
      <CommentForm postId={postId} />
      
      <hr className="my-6" />

      <CommentBox postId={postId} />
    </div>
  );
}
