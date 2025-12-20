import { api } from '@/shared';
import type { UpdateLectureContentRequest, LectureContentResponse } from '../types/backend';

export const updateLectureContent = async (
  contentId: number,
  request: UpdateLectureContentRequest
): Promise<LectureContentResponse> => {
  return api.put(`lecture-contents/${contentId}`, { json: request }).json<LectureContentResponse>();
};


