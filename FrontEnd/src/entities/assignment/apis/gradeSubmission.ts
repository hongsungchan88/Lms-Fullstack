import { api } from '@/shared';
import type { GradeRequest, SubmissionResponse } from '../types/backend';

export const gradeSubmission = async (
  submissionId: number,
  instructorNumber: number,
  request: GradeRequest
): Promise<SubmissionResponse> => {
  return api.post(`assignment/submissions/${submissionId}/grade`, {
    searchParams: { instructorNumber },
    json: request,
  }).json<SubmissionResponse>();
};


