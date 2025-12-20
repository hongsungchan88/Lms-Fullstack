import { api } from '@/shared';
import type { AssignmentResponse } from '../types/backend';

export const getAssignments = async (lectureId: number): Promise<AssignmentResponse[]> => {
  return api.get(`assignment/lecture/${lectureId}`).json<AssignmentResponse[]>();
};
