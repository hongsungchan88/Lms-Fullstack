import { api } from '@/shared';

export const deleteLecture = async (lectureId: number, instructorNumber: number): Promise<void> => {
  return api.delete(`lectures/${lectureId}`, {
    searchParams: { instructorNumber }
  }).json();
};


