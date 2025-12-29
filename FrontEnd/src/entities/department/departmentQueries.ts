import { useQuery } from '@tanstack/react-query';
import { getDepartments } from './apis';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
};

