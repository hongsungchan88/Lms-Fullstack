import { api } from '@/shared';
import type { StudentResponse } from '@/entities/student/apis';

export const getAllStudents = async (): Promise<StudentResponse[]> => {
  return api.get('students').json<StudentResponse[]>();
};


