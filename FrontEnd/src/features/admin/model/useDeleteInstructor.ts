import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInstructor } from '@/entities/admin/apis';

export const useDeleteInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instructorNumber: number) => deleteInstructor(instructorNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'instructors'] });
    },
  });
};


