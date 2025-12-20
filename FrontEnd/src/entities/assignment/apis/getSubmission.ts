import { api } from '@/shared';
import type { SubmissionResponse } from '../types/backend';

export const getSubmission = async (assignmentId: number, studentNumber: string): Promise<SubmissionResponse> => {
  return api.get(`assignment/${assignmentId}/submissions/${studentNumber}`).json<SubmissionResponse>();
};


