export interface User {
  id: string;
  nickname: string;
  password?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  studentNumber?: string;
  instructorNumber?: number;
  adminId?: string;
  name?: string;
  email?: string;
  phone?: string;
}
