import { useState } from 'react';
import { useAllLectures, useCreateLecture, useUpdateLecture, useDeleteLecture } from '@/features/admin/model';
import { useAllInstructors } from '@/features/admin/model';
import { LoadingSpinner } from '@/shared';
import type { LectureResponse } from '@/entities/lecture/types/backend';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '@/shared/ui/Modal';

export default function AdminLectures() {
  const { data: lectures, isLoading: lecturesLoading } = useAllLectures();
  const { data: instructors, isLoading: instructorsLoading } = useAllInstructors();
  const createMutation = useCreateLecture();
  const updateMutation = useUpdateLecture();
  const deleteMutation = useDeleteLecture();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureResponse | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    instructorNumber: '',
    totalLecture: '',
    category: '',
    thumbnailUrl: '',
  });

  if (lecturesLoading || instructorsLoading) {
    return <LoadingSpinner />;
  }

  const handleCreate = () => {
    setFormData({ title: '', instructorNumber: '', totalLecture: '', category: '', thumbnailUrl: '' });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (lecture: LectureResponse) => {
    setFormData({
      title: lecture.title,
      instructorNumber: String(lecture.instructorNumber),
      totalLecture: lecture.totalLecture?.toString() || '',
      category: lecture.category || '',
      thumbnailUrl: lecture.thumbnailUrl || '',
    });
    setEditingLecture(lecture);
  };

  const handleDelete = async (lectureId: number) => {
    if (confirm('정말 이 강의를 삭제하시겠습니까?')) {
      await deleteMutation.mutateAsync(lectureId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLecture) {
      await updateMutation.mutateAsync({
        lectureId: editingLecture.lectureId,
        request: {
          title: formData.title,
          totalLecture: formData.totalLecture ? parseInt(formData.totalLecture) : undefined,
          category: formData.category || undefined,
          thumbnailUrl: formData.thumbnailUrl || undefined,
        },
      });
      setEditingLecture(null);
    } else {
      await createMutation.mutateAsync({
        title: formData.title,
        instructorNumber: Number(formData.instructorNumber),
        totalLecture: formData.totalLecture ? parseInt(formData.totalLecture) : undefined,
        category: formData.category || undefined,
        thumbnailUrl: formData.thumbnailUrl || undefined,
      });
      setIsCreateModalOpen(false);
    }
    setFormData({ title: '', instructorNumber: '', totalLecture: '', category: '', thumbnailUrl: '' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">강의 개설 및 관리</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          강의 개설
        </button>
      </div>

      {lectures && lectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lectures.map((lecture) => (
            <div key={lecture.lectureId} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              {lecture.thumbnailUrl && (
                <img
                  src={lecture.thumbnailUrl}
                  alt={lecture.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-lg font-semibold mb-2">{lecture.title}</h3>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>교사: {lecture.instructorName}</p>
                <p>카테고리: {lecture.category || '미분류'}</p>
                <p>총 강의 수: {lecture.totalLecture || 0}강</p>
                <p>생성일: {new Date(lecture.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(lecture)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  수정
                </button>
                <button
                  onClick={() => handleDelete(lecture.lectureId)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          등록된 강의가 없습니다. 강의를 개설해주세요.
        </div>
      )}

      {/* 강의 생성/수정 모달 */}
      {(isCreateModalOpen || editingLecture) && (
        <Modal onClose={() => {
          setIsCreateModalOpen(false);
          setEditingLecture(null);
          setFormData({ title: '', instructorNumber: '', totalLecture: '', category: '', thumbnailUrl: '' });
        }}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingLecture ? '강의 수정' : '강의 개설'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  강의 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  담당 교사 *
                </label>
                <select
                  value={formData.instructorNumber}
                  onChange={(e) => setFormData({ ...formData, instructorNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!!editingLecture}
                >
                  <option value="">선택하세요</option>
                  {instructors?.map((instructor) => (
                    <option key={instructor.instructorNumber} value={instructor.instructorNumber}>
                      {instructor.name} ({instructor.instructorNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  총 강의 수
                </label>
                <input
                  type="number"
                  value={formData.totalLecture}
                  onChange={(e) => setFormData({ ...formData, totalLecture: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 프로그래밍, 웹 개발"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  썸네일 URL
                </label>
                <input
                  type="text"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingLecture ? '수정' : '개설'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingLecture(null);
                    setFormData({ title: '', instructorNumber: '', totalLecture: '', category: '', thumbnailUrl: '' });
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


