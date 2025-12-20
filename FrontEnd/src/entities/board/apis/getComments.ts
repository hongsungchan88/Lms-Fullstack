import { api } from '@/shared';
import type { CommentResponse } from '../types/backend';

export const getComments = async (postId: number): Promise<CommentResponse[]> => {
  return api.get(`board/posts/${postId}/comments`).json<CommentResponse[]>();
};


