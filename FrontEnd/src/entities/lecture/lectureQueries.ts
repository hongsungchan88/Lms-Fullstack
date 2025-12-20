import { getLecture } from '@/entities/lecture';
import { createUserKey } from '@/shared';
import { queryOptions } from '@tanstack/react-query';

export const lectureQueries = {
  lecture: () => [...createUserKey(), 'lecture'] as const,
  lectureDetail: (id: number) =>
    queryOptions({
      queryKey: [...lectureQueries.lecture(), id],
      queryFn: () => getLecture(id),
    }),
  // 하위 호환성을 위해 유지
  lectureList: (id: number) => lectureQueries.lectureDetail(id),
};
