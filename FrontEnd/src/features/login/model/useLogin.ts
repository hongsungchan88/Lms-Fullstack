import { postLogin, type PostLoginRequest } from '@/entities/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createUserKey } from '@/shared';
import type { User } from '@/entities/user';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: postLogin });

  const handleMutate = ({ id, password, role }: PostLoginRequest) => {
    mutation.mutate(
      { id, password, role },
      {
        onSuccess: (data) => {
          // 로그인 응답을 User 형식으로 변환하여 쿼리 캐시에 저장
              const user: User = {
                id: data.user.studentNumber || data.user.adminId || String(data.user.instructorNumber || ''),
                nickname: data.user.name,
                role: data.role,
                studentNumber: data.user.studentNumber,
                instructorNumber: data.user.instructorNumber,
                adminId: data.user.adminId,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone,
              };
          // 로컬 스토리지에 저장 (세션 기반 인증이 없는 경우)
          localStorage.setItem('user', JSON.stringify(user));
          queryClient.setQueryData(createUserKey(), { data: user });
          navigate('/');
        },
      }
    );
  };
  return { ...mutation, handleMutate };
};
