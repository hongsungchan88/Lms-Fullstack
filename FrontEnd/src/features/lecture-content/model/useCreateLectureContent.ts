import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLectureContent, type CreateLectureContentRequest } from '@/entities/lecture-content/apis';

export const useCreateLectureContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateLectureContentRequest) => createLectureContent(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lectureContents', variables.lectureId] });
    },
  });
};


