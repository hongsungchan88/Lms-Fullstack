import { api } from '@/shared';
import type { CreateCommentRequest, CommentResponse } from '../types/backend';

export const createComment = async (postId: number, request: CreateCommentRequest): Promise<CommentResponse> => {
  return api.post(`board/posts/${postId}/comments`, { json: request }).json<CommentResponse>();
};


