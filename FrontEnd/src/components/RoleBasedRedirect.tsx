import { Navigate, useOutletContext } from 'react-router-dom';
import type { User } from '@/entities/user/types';

interface RoleBasedRedirectProps {
  allowedRoles: ('STUDENT' | 'TEACHER')[];
  redirectTo: string;
}

export default function RoleBasedRedirect({ allowedRoles, redirectTo }: RoleBasedRedirectProps) {
  const user = useOutletContext<User | undefined>();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return null;
}


