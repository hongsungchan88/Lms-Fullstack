import type { User } from '@/entities/user';
import { api } from '@/shared';

export const getUser = async (): Promise<{ data: User | null }> => {
  // 로컬 스토리지에서 사용자 정보 가져오기 (세션 기반 인증이 없는 경우)
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return { data: user };
    } catch (e) {
      localStorage.removeItem('user');
    }
  }
  return { data: null };
};
