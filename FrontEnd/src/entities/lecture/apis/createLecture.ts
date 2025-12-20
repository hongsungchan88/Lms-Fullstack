import { api } from '@/shared';
import type { CreateLectureRequest, LectureResponse } from '@/entities/lecture/types/backend';

export const createLecture = async (request: CreateLectureRequest): Promise<LectureResponse> => {
  return api.post('lectures', { json: request }).json<LectureResponse>();
};


