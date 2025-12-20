import { useQuery } from '@tanstack/react-query';
import { getLectureContents } from '@/entities/lecture-content/apis';

export const useLectureContents = (lectureId: number) => {
  return useQuery({
    queryKey: ['lectureContents', lectureId],
    queryFn: () => getLectureContents(lectureId),
    enabled: !!lectureId,
  });
};


