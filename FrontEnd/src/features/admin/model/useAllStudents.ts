import { useQuery } from '@tanstack/react-query';
import { getAllStudents } from '@/entities/admin/apis';

export const useAllStudents = () => {
  return useQuery({
    queryKey: ['admin', 'students'],
    queryFn: getAllStudents,
  });
};


