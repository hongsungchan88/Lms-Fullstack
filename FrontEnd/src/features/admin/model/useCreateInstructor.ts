import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInstructor, type CreateInstructorRequest } from '@/entities/admin/apis';

export const useCreateInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateInstructorRequest) => createInstructor(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'instructors'] });
    },
  });
};


