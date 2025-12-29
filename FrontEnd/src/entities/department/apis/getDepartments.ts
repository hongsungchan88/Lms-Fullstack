import { api } from '@/shared';

export interface DepartmentResponse {
  departmentsId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const getDepartments = async (): Promise<DepartmentResponse[]> => {
  const response = await api.get('departments').json<DepartmentResponse[]>();
  return response;
};

