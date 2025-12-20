import { api } from '@/shared';

export const postLogout = async () => {
  return api.post('user/logout').json();
}


