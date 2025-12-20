export interface PostRegisterResponse {
  message: string;
}

export interface PostLoginResponse {
  user: {
    studentNumber?: string;
    instructorNumber?: number;
    adminId?: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}
