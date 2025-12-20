import { api } from '@/shared';
import type { UpdateLectureRequest, LectureResponse } from '@/entities/lecture/types/backend';

export const updateLecture = async (
  lectureId: number,
  request: UpdateLectureRequest
): Promise<LectureResponse> => {
  return api.put(`admin/lectures/${lectureId}`, { json: request }).json<LectureResponse>();
};


