import { useQuery } from '@tanstack/react-query';
import CourseCard from './CourseCard';
import { courseQueries } from '@/entities/course';
import { LoadingSpinner } from '@/shared';

export default function CourseRow() {
  const { data, isLoading, isError, error } = useQuery(courseQueries.courseData());

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
        <p className="text-gray-600">{error?.message || '강의 데이터를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-600">수강 중인 강의가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] gap-5 px-1 py-4">
      {data.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
