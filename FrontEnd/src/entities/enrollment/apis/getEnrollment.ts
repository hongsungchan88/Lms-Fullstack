import { api } from '@/shared';
import type { LectureResponse } from '@/entities/lecture/types/backend';

export const getEnrollment = async (): Promise<LectureResponse[]> => {
  return api.get('enrollment').json<LectureResponse[]>();
};
