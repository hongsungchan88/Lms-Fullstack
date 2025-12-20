import { getLecture, lectureQueries } from '@/entities/lecture';
import type { QueryClient } from '@tanstack/react-query';

interface LectureListLoader {
  id: number;
  queryClient: QueryClient;
}
export async function lectureListLoader({
  id,
  queryClient,
}: LectureListLoader) {
  const data = await getLecture(id);
  queryClient.setQueryData(lectureQueries.lectureDetail(id).queryKey, data);
  return data;
}
