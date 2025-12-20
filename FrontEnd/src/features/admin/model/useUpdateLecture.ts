import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLecture, type UpdateLectureRequest } from '@/entities/admin/apis';

export const useUpdateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lectureId, request }: { lectureId: number; request: UpdateLectureRequest }) =>
      updateLecture(lectureId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lectures'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment'] });
    },
  });
};


