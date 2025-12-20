import { useOutletContext } from 'react-router-dom';
import type { User } from '@/entities/user/types';
import TeacherDashboard from '@/pages/TeacherDashboard';
import MyClassroom from '@/pages/MyClassroom';
import AdminDashboard from '@/pages/AdminDashboard';

export default function RoleBasedDashboard() {
  const user = useOutletContext<User | undefined>();
  
  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }
  
  if (user?.role === 'TEACHER') {
    return <TeacherDashboard />;
  }
  
  return <MyClassroom />;
}

