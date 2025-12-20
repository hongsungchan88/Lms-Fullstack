import { api } from '@/shared';
import type { LectureResponse } from '@/entities/lecture/types/backend';

export const getInstructorLectures = async (instructorNumber: number): Promise<LectureResponse[]> => {
  return api.get(`lectures/instructor/${instructorNumber}`).json<LectureResponse[]>();
};


