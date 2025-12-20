import { api } from '@/shared';

export interface InstructorResponse {
  instructorNumber: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getAllInstructors = async (): Promise<InstructorResponse[]> => {
  return api.get('instructor').json<InstructorResponse[]>();
};


