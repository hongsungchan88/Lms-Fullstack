import { api } from '@/shared';

export const deleteLecture = async (lectureId: number): Promise<void> => {
  return api.delete(`admin/lectures/${lectureId}`).json();
};


