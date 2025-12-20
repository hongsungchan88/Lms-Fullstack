import { useQuery } from '@tanstack/react-query';
import { getAllLectures } from '@/entities/admin/apis';

export const useAllLectures = () => {
  return useQuery({
    queryKey: ['admin', 'lectures'],
    queryFn: getAllLectures,
  });
};


