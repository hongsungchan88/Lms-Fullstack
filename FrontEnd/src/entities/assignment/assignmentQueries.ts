import { getAssignments } from '@/entities/assignment';
import { queryOptions } from '@tanstack/react-query';

export const assignmentQueries = {
  all: (lectureId: number) =>
    queryOptions({
      queryKey: ['assignments', lectureId],
      queryFn: () => getAssignments(lectureId),
    }),
};
