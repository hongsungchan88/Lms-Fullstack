import { api } from '@/shared';
import type { LectureContentResponse } from '../types/backend';

export const getLectureContents = async (lectureId: number): Promise<LectureContentResponse[]> => {
  return api.get(`lecture-contents/lecture/${lectureId}`).json<LectureContentResponse[]>();
};


