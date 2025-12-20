import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLectureContent } from '@/entities/lecture-content/apis';

export const useDeleteLectureContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, lectureId }: { contentId: number; lectureId: number }) => {
      return deleteLectureContent(contentId).then(() => ({ lectureId }));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lectureContents', variables.lectureId] });
    },
  });
};


