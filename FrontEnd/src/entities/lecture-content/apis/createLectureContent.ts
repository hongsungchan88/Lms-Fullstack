import { api } from '@/shared';
import type { CreateLectureContentRequest, LectureContentResponse } from '../types/backend';

export const createLectureContent = async (request: CreateLectureContentRequest): Promise<LectureContentResponse> => {
  return api.post('lecture-contents', { json: request }).json<LectureContentResponse>();
};


