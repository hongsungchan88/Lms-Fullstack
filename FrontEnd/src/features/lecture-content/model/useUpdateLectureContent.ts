import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLectureContent, type UpdateLectureContentRequest } from '@/entities/lecture-content/apis';
import type { LectureContentResponse } from '@/entities/lecture-content/types/backend';

export const useUpdateLectureContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, request }: { contentId: number; request: UpdateLectureContentRequest }) =>
      updateLectureContent(contentId, request),
    onSuccess: (data: LectureContentResponse) => {
      queryClient.invalidateQueries({ queryKey: ['lectureContents', data.lectureId] });
    },
  });
};


