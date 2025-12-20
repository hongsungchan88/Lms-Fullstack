import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLecture } from '@/entities/lecture';
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

export const useDeleteLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lectureId: number) => {
      const user = getUserFromStorage();
      if (!user?.instructorNumber) {
        throw new Error('교사 정보를 찾을 수 없습니다.');
      }
      return deleteLecture(lectureId, user.instructorNumber);
    },
    onSuccess: () => {
      const user = getUserFromStorage();
      if (user?.instructorNumber) {
        queryClient.invalidateQueries({ queryKey: ['instructorLectures', user.instructorNumber] });
      }
    },
  });
};

