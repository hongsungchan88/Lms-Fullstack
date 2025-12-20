import { useQuery } from '@tanstack/react-query';
import { getAllStudents } from '@/entities/student/apis';

export const useAllStudents = () => {
  return useQuery({
    queryKey: ['allStudents'],
    queryFn: getAllStudents,
  });
};


