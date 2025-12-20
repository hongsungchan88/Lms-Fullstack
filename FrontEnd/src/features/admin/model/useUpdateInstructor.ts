import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInstructor, type UpdateInstructorRequest } from '@/entities/admin/apis';

export const useUpdateInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ instructorNumber, request }: { instructorNumber: number; request: UpdateInstructorRequest }) =>
      updateInstructor(instructorNumber, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'instructors'] });
    },
  });
};


