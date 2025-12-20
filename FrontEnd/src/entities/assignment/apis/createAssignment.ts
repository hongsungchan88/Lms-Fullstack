import { api } from '@/shared';
import type { CreateAssignmentRequest, AssignmentResponse } from '../types/backend';

export const createAssignment = async (request: CreateAssignmentRequest): Promise<AssignmentResponse> => {
  return api.post('assignment', { json: request }).json<AssignmentResponse>();
};
