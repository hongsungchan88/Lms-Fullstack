import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEnrollment, postEnrollment } from '@/entities/enrollment/apis';
import { createUserKey } from '@/shared';
import type { User } from '@/entities/user/types';

export const useEnrollment = () => {
  return useQuery({
    queryKey: ['enrollment'],
    queryFn: getEnrollment,
  });
};

export const useSubmitEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lectureIds: number[]) => {
      // 로컬 스토리지에서 사용자 정보 가져오기
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('로그인이 필요합니다.');
      }

      let user: User;
      try {
        user = JSON.parse(storedUser);
      } catch (e) {
        throw new Error('사용자 정보를 불러올 수 없습니다.');
      }

      if (!user.studentNumber) {
        throw new Error('학생 정보를 찾을 수 없습니다.');
      }
      
      return postEnrollment(user.studentNumber, lectureIds);
    },
    onSuccess: () => {
      // 수강 신청 후 내 강의실 데이터 갱신
      queryClient.invalidateQueries({ queryKey: createUserKey() });
      queryClient.invalidateQueries({ queryKey: ['my-classroom'] });
    },
  });
};

