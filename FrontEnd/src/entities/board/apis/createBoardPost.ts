import { api } from '@/shared';
import type { CreateBoardPostRequest, BoardPostResponse } from '../types/backend';

export const createBoardPost = async (request: CreateBoardPostRequest): Promise<BoardPostResponse> => {
  return api.post('board/posts', { json: request }).json<BoardPostResponse>();
};


