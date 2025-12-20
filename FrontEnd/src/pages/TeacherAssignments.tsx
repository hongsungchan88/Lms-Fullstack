import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignments, createAssignment, getSubmissions, gradeSubmission } from '@/entities/assignment/apis';
import { LoadingSpinner } from '@/shared';
import type { AssignmentResponse, SubmissionResponse, CreateAssignmentRequest, GradeRequest } from '@/entities/assignment/types/backend';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
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

export default function TeacherAssignments() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const lectureIdNum = lectureId ? parseInt(lectureId) : 0;
  const queryClient = useQueryClient();
  const user = getUserFromStorage();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', lectureIdNum],
    queryFn: () => getAssignments(lectureIdNum),
    enabled: !!lectureIdNum,
  });

  const { data: submissions } = useQuery({
    queryKey: ['submissions', lectureIdNum],
    queryFn: async () => {
      if (!assignments) return [];
      const allSubmissions: { [key: number]: SubmissionResponse[] } = {};
      for (const assignment of assignments) {
        try {
          const subs = await getSubmissions(assignment.assignmentId);
          allSubmissions[assignment.assignmentId] = subs;
        } catch (e) {
          allSubmissions[assignment.assignmentId] = [];
        }
      }
      return allSubmissions;
    },
    enabled: !!assignments && assignments.length > 0,
  });

  const createMutation = useMutation({
    mutationFn: (request: CreateAssignmentRequest) => createAssignment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', lectureIdNum] });
    },
  });

  const gradeMutation = useMutation({
    mutationFn: ({ submissionId, request }: { submissionId: number; request: GradeRequest }) => {
      if (!user?.instructorNumber) throw new Error('교사 정보를 찾을 수 없습니다.');
      return gradeSubmission(submissionId, user.instructorNumber, request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', lectureIdNum] });
    },
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentResponse | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: '',
    filePath: '',
    originalFileName: '',
  });

  const [gradingData, setGradingData] = useState<{ [key: number]: { score: string; feedback: string } }>({});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleCreate = () => {
    setFormData({ title: '', description: '', dueDate: '', maxScore: '', filePath: '', originalFileName: '' });
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const request: CreateAssignmentRequest = {
      title: formData.title,
      description: formData.description || undefined,
      dueDate: formData.dueDate,
      lectureId: lectureIdNum,
      maxScore: parseInt(formData.maxScore),
      filePath: formData.filePath || undefined,
      originalFileName: formData.originalFileName || undefined,
    };
    await createMutation.mutateAsync(request);
    setIsCreateModalOpen(false);
    setFormData({ title: '', description: '', dueDate: '', maxScore: '', filePath: '', originalFileName: '' });
  };

  const handleGrade = async (submissionId: number) => {
    const data = gradingData[submissionId];
    if (!data || !data.score) {
      alert('점수를 입력하세요.');
      return;
    }
    const request: GradeRequest = {
      score: parseInt(data.score),
      feedback: data.feedback || undefined,
    };
    await gradeMutation.mutateAsync({ submissionId, request });
    setGradingData({ ...gradingData, [submissionId]: { score: '', feedback: '' } });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">과제 관리</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          과제 생성
        </button>
      </div>

      {assignments && assignments.length > 0 ? (
        <div className="space-y-6">
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
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {selectedAssignment?.assignmentId === assignment.assignmentId ? '접기' : '제출 현황'}
                </button>
              </div>

              {selectedAssignment?.assignmentId === assignment.assignmentId && submissions && submissions[assignment.assignmentId] && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-3">제출 현황 ({submissions[assignment.assignmentId].length}명)</h4>
                  <div className="space-y-3">
                    {submissions[assignment.assignmentId].map((submission) => (
                      <div key={submission.submissionId} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{submission.studentName} ({submission.studentNumber})</p>
                            <p className="text-sm text-gray-600">
                              제출일: {new Date(submission.submittedAt).toLocaleString('ko-KR')}
                            </p>
                            {submission.content && (
                              <p className="text-sm text-gray-700 mt-2">{submission.content}</p>
                            )}
                            {submission.filePath && (
                              <a href={submission.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                                {submission.originalFileName || '파일 다운로드'}
                              </a>
                            )}
                          </div>
                          {submission.score !== null && submission.score !== undefined ? (
                            <div className="text-right">
                              <p className="font-bold text-lg">{submission.score}점 / {assignment.maxScore}점</p>
                              {submission.feedback && (
                                <p className="text-sm text-gray-600 mt-1">{submission.feedback}</p>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">미채점</div>
                          )}
                        </div>
                        {submission.score === null || submission.score === undefined ? (
                          <div className="mt-3 flex gap-2">
                            <input
                              type="number"
                              placeholder="점수"
                              value={gradingData[submission.submissionId]?.score || ''}
                              onChange={(e) => setGradingData({
                                ...gradingData,
                                [submission.submissionId]: {
                                  ...gradingData[submission.submissionId],
                                  score: e.target.value,
                                },
                              })}
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                              min="0"
                              max={assignment.maxScore}
                            />
                            <input
                              type="text"
                              placeholder="피드백"
                              value={gradingData[submission.submissionId]?.feedback || ''}
                              onChange={(e) => setGradingData({
                                ...gradingData,
                                [submission.submissionId]: {
                                  ...gradingData[submission.submissionId],
                                  feedback: e.target.value,
                                },
                              })}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => handleGrade(submission.submissionId)}
                              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              disabled={gradeMutation.isPending}
                            >
                              채점
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          등록된 과제가 없습니다. 과제를 생성해주세요.
        </div>
      )}

      {/* 과제 생성 모달 */}
      {isCreateModalOpen && (
        <Modal onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ title: '', description: '', dueDate: '', maxScore: '', filePath: '', originalFileName: '' });
        }}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">과제 생성</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">과제 제목 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">과제 설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">마감일 *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">만점 *</label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">첨부파일 URL</label>
                <input
                  type="url"
                  value={formData.filePath}
                  onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={createMutation.isPending}
                >
                  생성
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({ title: '', description: '', dueDate: '', maxScore: '', filePath: '', originalFileName: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}


