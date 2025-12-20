import clsx from 'clsx';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/entities/board/apis';
import { useAuth } from '@/entities/user/hooks/useAuth';
import type { CreateCommentRequest } from '@/entities/board/types/backend';

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const user = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (request: CreateCommentRequest) => createComment(postId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setContent('');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('댓글 내용을 입력하세요.');
      return;
    }
    const request: CreateCommentRequest = {
      content,
      author: user.nickname,
      authorRole: user.role,
    };
    mutate(request);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="댓글을 작성하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={clsx(
              'flex-1',
              'border-2 border-gray-200',
              'rounded-xl',
              'px-4 py-2',
              'text-sm',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-blue-500',
            )}
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            등록
          </button>
        </div>
      </div>
    </form>
  );
}
