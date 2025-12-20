import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared';
import type { StudentResponse } from '@/entities/student/apis';

export interface UpdateStudentRequest {
  name: string;
  email: string;
  phone?: string;
}

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentNumber, request }: { studentNumber: string; request: UpdateStudentRequest }) =>
      api.put(`students/${studentNumber}`, { json: request }).json<StudentResponse>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
    },
  });
};


