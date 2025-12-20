import { api } from '@/shared';
import type { UpdateLectureRequest, LectureResponse } from '@/entities/lecture/types/backend';

export const updateLecture = async (
  lectureId: number,
  instructorNumber: number,
  request: UpdateLectureRequest
): Promise<LectureResponse> => {
  return api.put(`lectures/${lectureId}`, {
    searchParams: { instructorNumber },
    json: request
  }).json<LectureResponse>();
};


