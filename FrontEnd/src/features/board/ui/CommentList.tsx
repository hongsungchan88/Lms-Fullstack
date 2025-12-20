import { CommentCard } from '@/features/board';
import { useQuery } from '@tanstack/react-query';
import { getComments } from '@/entities/board/apis';
import { LoadingSpinner } from '@/shared';
import type { CommentResponse } from '@/entities/board/types/backend';
import type { Comment } from '@/entities/board';

interface CommentListProps {
  postId: number;
}

// 백엔드 CommentResponse를 프론트엔드 Comment 타입으로 변환
const convertToComment = (comment: CommentResponse): Comment => ({
  id: comment.commentId,
  postId: comment.postId,
  author: comment.author,
  avatar: `https://i.pravatar.cc/150?u=${comment.author}`,
  content: comment.content,
});

export default function CommentList({ postId }: CommentListProps) {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="border-t border-gray-200 mt-4 pt-2">
        <p className="text-gray-500 text-sm">댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 mt-4 pt-2">
      <div>
        {comments.map(comment => (
          <CommentCard key={comment.commentId} comment={convertToComment(comment)} />
        ))}
      </div>
    </div>
  );
}
