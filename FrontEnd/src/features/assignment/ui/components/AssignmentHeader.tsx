import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssignment, getSubmission } from '@/entities/assignment/apis';
import { LoadingSpinner } from '@/shared';
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

export default function AssignmentHeader() {
  const { assignmentId, id: lectureId } = useParams<{ assignmentId: string; id: string }>();
  const user = getUserFromStorage();
  const assignmentIdNum = assignmentId ? parseInt(assignmentId) : 0;

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', assignmentIdNum],
    queryFn: () => getAssignment(assignmentIdNum),
    enabled: !!assignmentIdNum,
  });

  const { data: submission } = useQuery({
    queryKey: ['submission', assignmentIdNum, user?.studentNumber],
    queryFn: () => {
      if (!user?.studentNumber) throw new Error('학생 정보를 찾을 수 없습니다.');
      return getSubmission(assignmentIdNum, user.studentNumber);
    },
    enabled: !!assignmentIdNum && !!user?.studentNumber,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!assignment) {
    return (
      <header className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">과제를 찾을 수 없습니다.</h1>
      </header>
    );
  }

  const isSubmitted = !!submission;
  const score = submission?.score;

  return (
    <header className="p-6 md:p-8">
      <h1
        id="page-title"
        className="text-2xl font-bold text-gray-800 mt-4 mb-2"
      >
        {assignment.title}
      </h1>
      <div className="flex items-center text-black text-sm">
        <span className="mr-2">{assignment.lectureTitle || '과제'}</span>
        {isSubmitted && (
          <span
            className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold"
            aria-label="제출 완료"
          >
            제출완료
          </span>
        )}
        {score !== null && score !== undefined && (
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            {score}점 / {assignment.maxScore}점
          </span>
        )}
      </div>
      {assignment.description && (
        <p className="mt-2 text-gray-600">{assignment.description}</p>
      )}
      <p className="mt-2 text-sm text-gray-500">
        마감일: {new Date(assignment.dueDate).toLocaleDateString('ko-KR')}
      </p>
    </header>
  );
}
