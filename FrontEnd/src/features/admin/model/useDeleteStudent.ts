import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared';

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentNumber: string) => api.delete(`students/${studentNumber}`).json<void>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
    },
  });
};


