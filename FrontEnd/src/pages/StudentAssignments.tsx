import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignments, getSubmission, submitAssignment } from '@/entities/assignment/apis';
import { LoadingSpinner } from '@/shared';
import { Header } from '@/widgets';
import type { AssignmentResponse, SubmissionRequest } from '@/entities/assignment/types/backend';
import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Modal from '@/shared/ui/Modal';
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

export default function StudentAssignments() {
  const { id: lectureId } = useParams<{ id: string }>();
  const lectureIdNum = lectureId ? parseInt(lectureId) : 0;
  const queryClient = useQueryClient();
  const user = getUserFromStorage();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', lectureIdNum],
    queryFn: () => getAssignments(lectureIdNum),
    enabled: !!lectureIdNum,
  });

  const submitMutation = useMutation({
    mutationFn: ({ assignmentId, request }: { assignmentId: number; request: SubmissionRequest }) => {
      if (!user?.studentNumber) throw new Error('학생 정보를 찾을 수 없습니다.');
      return submitAssignment(assignmentId, user.studentNumber, request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', lectureIdNum] });
    },
  });

  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentResponse | null>(null);
  const [submissionData, setSubmissionData] = useState<{ [key: number]: { content: string; filePath: string } }>({});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (assignmentId: number) => {
    const data = submissionData[assignmentId];
    if (!data || (!data.content && !data.filePath)) {
      alert('내용 또는 파일을 입력하세요.');
      return;
    }
    const request: SubmissionRequest = {
      content: data.content || undefined,
      filePath: data.filePath || undefined,
    };
    await submitMutation.mutateAsync({ assignmentId, request });
    setSubmissionData({ ...submissionData, [assignmentId]: { content: '', filePath: '' } });
    setSelectedAssignment(null);
    alert('과제가 제출되었습니다.');
  };

  return (
    <>
      <Header />
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">과제 목록</h2>

      {assignments && assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.assignmentId} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{assignment.title}</h3>
                  {assignment.description && (
                    <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    <p>마감일: {new Date(assignment.dueDate).toLocaleDateString('ko-KR')}</p>
                    <p>만점: {assignment.maxScore}점</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAssignment(selectedAssignment?.assignmentId === assignment.assignmentId ? null : assignment)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedAssignment?.assignmentId === assignment.assignmentId ? '접기' : '제출하기'}
                </button>
              </div>

              {selectedAssignment?.assignmentId === assignment.assignmentId && (
                <div className="mt-4 border-t pt-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">제출 내용</label>
                      <textarea
                        value={submissionData[assignment.assignmentId]?.content || ''}
                        onChange={(e) => setSubmissionData({
                          ...submissionData,
                          [assignment.assignmentId]: {
                            ...submissionData[assignment.assignmentId],
                            content: e.target.value,
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="과제 내용을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">파일 URL</label>
                      <input
                        type="url"
                        value={submissionData[assignment.assignmentId]?.filePath || ''}
                        onChange={(e) => setSubmissionData({
                          ...submissionData,
                          [assignment.assignmentId]: {
                            ...submissionData[assignment.assignmentId],
                            filePath: e.target.value,
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      onClick={() => handleSubmit(assignment.assignmentId)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? '제출 중...' : '제출하기'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          등록된 과제가 없습니다.
        </div>
      )}
    </div>
    </>
  );
}


