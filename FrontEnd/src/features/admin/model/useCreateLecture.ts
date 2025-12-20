import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLecture, type CreateLectureRequest } from '@/entities/admin/apis';

export const useCreateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateLectureRequest) => createLecture(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lectures'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment'] });
    },
  });
};


