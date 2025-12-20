import { getPosts } from '@/entities/board/apis';
import { createUserKey } from '@/shared';
import { queryOptions } from '@tanstack/react-query';

export const boardQueries = {
  board: () => [...createUserKey(), 'board'] as const,
  postList: (lectureId?: number, category?: string) =>
    queryOptions({
      queryKey: [...boardQueries.board(), 'list', lectureId, category],
      queryFn: () => getPosts(lectureId, category),
    }),
};
