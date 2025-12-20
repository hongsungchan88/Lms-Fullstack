import { api } from '@/shared';

export const deleteInstructor = async (instructorNumber: number): Promise<void> => {
  return api.delete(`instructor/${instructorNumber}`).json();
};


