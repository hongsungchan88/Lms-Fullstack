import { useQuery } from '@tanstack/react-query';
import { getAllInstructors } from '@/entities/admin/apis';

export const useAllInstructors = () => {
  return useQuery({
    queryKey: ['admin', 'instructors'],
    queryFn: getAllInstructors,
  });
};


