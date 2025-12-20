import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLecture, type UpdateLectureRequest } from '@/entities/lecture';
import type { User } from '@/entities/user/types';

const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export const useUpdateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lectureId, request }: { lectureId: number; request: UpdateLectureRequest }) => {
      const user = getUserFromStorage();
      if (!user?.instructorNumber) {
        throw new Error('교사 정보를 찾을 수 없습니다.');
      }
      return updateLecture(lectureId, user.instructorNumber, request);
    },
    onSuccess: () => {
      const user = getUserFromStorage();
      if (user?.instructorNumber) {
        queryClient.invalidateQueries({ queryKey: ['instructorLectures', user.instructorNumber] });
      }
    },
  });
};

