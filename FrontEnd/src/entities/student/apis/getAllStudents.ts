import { api } from '@/shared';

export interface StudentResponse {
  studentNumber: string;
  name: string;
  email: string;
  phone: string | null;
  departmentsId: number;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllStudents = async (): Promise<StudentResponse[]> => {
  return api.get('students').json<StudentResponse[]>();
};


