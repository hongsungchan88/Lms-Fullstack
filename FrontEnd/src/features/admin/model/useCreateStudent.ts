import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent, type CreateStudentRequest } from '@/entities/student/apis';

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateStudentRequest) => createStudent(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
    },
  });
};


