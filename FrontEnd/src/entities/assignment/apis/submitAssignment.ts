import { api } from '@/shared';
import type { SubmissionRequest, SubmissionResponse } from '../types/backend';

export const submitAssignment = async (
  assignmentId: number,
  studentNumber: string,
  request: SubmissionRequest
): Promise<SubmissionResponse> => {
  return api.post(`assignment/${assignmentId}/submit`, {
    searchParams: { studentNumber },
    json: request,
  }).json<SubmissionResponse>();
};


