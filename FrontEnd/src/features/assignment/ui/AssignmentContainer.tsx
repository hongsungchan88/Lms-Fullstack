import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getSubmission, submitAssignment } from '@/entities/assignment/apis';
import { LoadingSpinner } from '@/shared';
import type { User } from '@/entities/user/types';
import type { SubmissionRequest } from '@/entities/assignment/types/backend';

const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export default function AssignmentContainer() {
  const { assignmentId } = useParams() as { assignmentId: string };
  const assignmentIdNum = assignmentId ? parseInt(assignmentId) : 0;
  const user = getUserFromStorage();
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [filePath, setFilePath] = useState('');

  const { data: submission, isLoading } = useQuery({
    queryKey: ['submission', assignmentIdNum, user?.studentNumber],
    queryFn: () => {
      if (!user?.studentNumber) throw new Error('학생 정보를 찾을 수 없습니다.');
      return getSubmission(assignmentIdNum, user.studentNumber);
    },
    enabled: !!assignmentIdNum && !!user?.studentNumber,
  });

  const submitMutation = useMutation({
    mutationFn: (request: SubmissionRequest) => {
      if (!user?.studentNumber) throw new Error('학생 정보를 찾을 수 없습니다.');
      return submitAssignment(assignmentIdNum, user.studentNumber, request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission', assignmentIdNum, user?.studentNumber] });
      setContent('');
      setFilePath('');
      alert('과제가 제출되었습니다.');
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !filePath.trim()) {
      alert('내용 또는 파일 URL을 입력하세요.');
      return;
    }
    const request: SubmissionRequest = {
      content: content || undefined,
      filePath: filePath || undefined,
    };
    await submitMutation.mutateAsync(request);
  };

  return (
    <section className="p-6 md:p-8 mb-4" aria-labelledby="submission-heading">
      <h2
        id="submission-heading"
        className="text-xl font-semibold text-gray-800 mb-6"
      >
        과제 제출
      </h2>
      
      {submission ? (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">제출된 과제</h3>
          {submission.content && (
            <p className="text-gray-700 mb-2 whitespace-pre-wrap">{submission.content}</p>
          )}
          {submission.filePath && (
            <a
              href={submission.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {submission.originalFileName || '파일 다운로드'}
            </a>
          )}
          <p className="text-sm text-gray-500 mt-2">
            제출일: {new Date(submission.submittedAt).toLocaleString('ko-KR')}
          </p>
          {submission.score !== null && submission.score !== undefined && (
            <p className="text-sm font-semibold text-green-600 mt-2">
              점수: {submission.score}점
            </p>
          )}
          {submission.feedback && (
            <p className="text-sm text-gray-600 mt-2">피드백: {submission.feedback}</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제출 내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="과제 내용을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              파일 URL (선택)
            </label>
            <input
              type="url"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitMutation.isPending ? '제출 중...' : '제출하기'}
          </button>
        </form>
      )}
    </section>
  );
}

