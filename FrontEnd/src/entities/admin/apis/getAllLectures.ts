import { api } from '@/shared';
import type { LectureResponse } from '@/entities/lecture/types/backend';

export const getAllLectures = async (): Promise<LectureResponse[]> => {
  return api.get('admin/lectures').json<LectureResponse[]>();
};


