import { api } from '@/shared';
import type { AssignmentResponse } from '../types/backend';

export const getAssignment = async (assignmentId: number): Promise<AssignmentResponse> => {
  return api.get(`assignment/${assignmentId}`).json<AssignmentResponse>();
};


