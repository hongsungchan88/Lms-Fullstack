import { api } from '@/shared';
import type { BoardPostResponse } from '../types/backend';

export const getBoardPosts = async (lectureId?: number, category?: string): Promise<BoardPostResponse[]> => {
  if (lectureId && category) {
    return api.get(`board/posts/lecture/${lectureId}/category/${category}`).json<BoardPostResponse[]>();
  } else if (lectureId) {
    return api.get(`board/posts/lecture/${lectureId}`).json<BoardPostResponse[]>();
  }
  return api.get('board/posts').json<BoardPostResponse[]>();
};


