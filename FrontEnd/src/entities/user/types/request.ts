export interface PostLoginRequest {
  id: string;
  password: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface PostRegisterRequest {
  id: string;
  password: string;
}
