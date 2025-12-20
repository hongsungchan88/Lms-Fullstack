import { Outlet, useOutletContext } from 'react-router-dom';
import Layout from '@/widgets/AppLayout';
import type { User } from '@/entities/user/types';

interface RoleBasedLayoutProps {
  allowedRoles: ('STUDENT' | 'TEACHER')[];
}

export default function RoleBasedLayout({ allowedRoles }: RoleBasedLayoutProps) {
  const user = useOutletContext<User | undefined>();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }
  
  return (
    <Layout>
      <Outlet context={user} />
    </Layout>
  );
}


