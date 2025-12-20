import type { LectureResponse } from '@/entities/lecture/types/backend';
import { api } from '@/shared';

export const getLecture = async (id: number): Promise<LectureResponse> => {
  return await api.get(`lecture/${id}`).json<LectureResponse>();
};

// 하위 호환성을 위해 유지
export const getLectureList = async (id: number): Promise<LectureResponse> => {
  return await getLecture(id);
};
