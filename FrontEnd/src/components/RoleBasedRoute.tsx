import { useOutletContext } from 'react-router-dom';
import type { User } from '@/entities/user/types';
import { ReactNode } from 'react';

interface RoleBasedRouteProps {
  allowedRoles: ('STUDENT' | 'TEACHER')[];
  children: ReactNode;
}

export default function RoleBasedRoute({ allowedRoles, children }: RoleBasedRouteProps) {
  const user = useOutletContext<User | undefined>();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }
  
  return <>{children}</>;
}
