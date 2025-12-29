import { useState } from 'react';
import { useInstructorLectures, useCreateLecture, useUpdateLecture, useDeleteLecture } from '@/features/lecture/model';
import { LoadingSpinner } from '@/shared';
import type { LectureResponse, CreateLectureRequest, UpdateLectureRequest } from '@/entities/lecture/types/backend';
import { PlusIcon, PencilIcon, TrashIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Modal from '@/shared/ui/Modal';

export default function TeacherLectures() {
  const { data: lectures, isLoading } = useInstructorLectures();
  const createMutation = useCreateLecture();
  const updateMutation = useUpdateLecture();
  const deleteMutation = useDeleteLecture();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureResponse | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    totalLecture: '',
    category: '',
    thumbnailUrl: '',
  });

  const handleCreate = () => {
    setFormData({ title: '', totalLecture: '', category: '', thumbnailUrl: '' });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (lecture: LectureResponse) => {
    setFormData({
      title: lecture.title,
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
      const updateRequest: UpdateLectureRequest = {
        title: formData.title,
        totalLecture: formData.totalLecture ? parseInt(formData.totalLecture) : undefined,
        category: formData.category || undefined,
        thumbnailUrl: formData.thumbnailUrl || undefined,
      };
      await updateMutation.mutateAsync({ lectureId: editingLecture.lectureId, request: updateRequest });
      setEditingLecture(null);
    } else {
      const createRequest: CreateLectureRequest = {
        title: formData.title,
        totalLecture: formData.totalLecture ? parseInt(formData.totalLecture) : undefined,
        category: formData.category || undefined,
        thumbnailUrl: formData.thumbnailUrl || undefined,
      };
      await createMutation.mutateAsync(createRequest);
      setIsCreateModalOpen(false);
    }
    setFormData({ title: '', totalLecture: '', category: '', thumbnailUrl: '' });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">강의 관리</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
        >
          <PlusIcon className="w-5 h-5" />
          강의 생성
        </button>
      </div>

      {lectures && lectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <div key={lecture.lectureId} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
              {lecture.thumbnailUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={lecture.thumbnailUrl}
                    alt={lecture.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{lecture.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {lecture.category || '미분류'}
                    </span>
                  </div>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">총 강의 수:</span>
                    <span>{lecture.totalLecture || 0}강</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    생성일: {new Date(lecture.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => window.location.href = `/teacher/lectures/${lecture.lectureId}/contents`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-200 font-medium text-sm"
                    >
                      회차 관리
                    </button>
                    <button
                      onClick={() => window.location.href = `/teacher/lectures/${lecture.lectureId}/assignments`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-200 font-medium text-sm"
                    >
                      과제 관리
                    </button>
                  </div>
                  <button
                    onClick={() => window.location.href = `/teacher/lectures/${lecture.lectureId}/notice`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all duration-200 font-medium text-sm"
                  >
                    공지사항 관리
                  </button>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(lecture)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
                    >
                      <PencilIcon className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(lecture.lectureId)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl shadow-md border border-gray-100 text-center">
          <BookOpenIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">등록된 강의가 없습니다. 강의를 생성해주세요.</p>
        </div>
      )}

      {/* 강의 생성/수정 모달 */}
      {(isCreateModalOpen || editingLecture) && (
        <Modal onClose={() => {
          setIsCreateModalOpen(false);
          setEditingLecture(null);
          setFormData({ title: '', totalLecture: '', category: '', thumbnailUrl: '' });
        }}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingLecture ? '강의 수정' : '강의 생성'}
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
                  {editingLecture ? '수정' : '생성'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingLecture(null);
                    setFormData({ title: '', totalLecture: '', category: '', thumbnailUrl: '' });
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
