import { api } from '@/shared';
import type { InstructorResponse } from './getAllInstructors';

export interface UpdateInstructorRequest {
  name: string;
  email: string;
  phone?: string;
}

export const updateInstructor = async (
  instructorNumber: number,
  request: UpdateInstructorRequest
): Promise<InstructorResponse> => {
  return api.put(`instructor/${instructorNumber}`, { json: request }).json<InstructorResponse>();
};


