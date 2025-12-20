import type { PostLoginRequest, PostLoginResponse } from '@/entities/user';
import { api } from '@/shared';

export const postLogin = async ({ id, password, role }: PostLoginRequest): Promise<PostLoginResponse> => {
  return api.post('user/login', { json: { id, password, role } }).json<PostLoginResponse>();
}