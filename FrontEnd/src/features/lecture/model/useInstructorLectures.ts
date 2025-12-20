import { useQuery } from '@tanstack/react-query';
import { getInstructorLectures } from '@/entities/lecture';
import type { User } from '@/entities/user/types';

const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export const useInstructorLectures = () => {
  const user = getUserFromStorage();
  const instructorNumber = user?.instructorNumber;

  return useQuery({
    queryKey: ['instructorLectures', instructorNumber],
    queryFn: () => getInstructorLectures(instructorNumber!),
    enabled: !!instructorNumber,
  });
};

