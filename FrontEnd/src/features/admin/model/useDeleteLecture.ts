import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLecture } from '@/entities/admin/apis';

export const useDeleteLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lectureId: number) => deleteLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lectures'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment'] });
    },
  });
};


