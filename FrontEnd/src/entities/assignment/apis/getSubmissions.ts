import { api } from '@/shared';
import type { SubmissionResponse } from '../types/backend';

export const getSubmissions = async (assignmentId: number): Promise<SubmissionResponse[]> => {
  return api.get(`assignment/${assignmentId}/submissions`).json<SubmissionResponse[]>();
};


