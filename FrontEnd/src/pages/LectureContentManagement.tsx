import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLectureContents, useCreateLectureContent, useUpdateLectureContent, useDeleteLectureContent } from '@/features/lecture-content/model';
import { LoadingSpinner } from '@/shared';
import type { LectureContentResponse, CreateLectureContentRequest, UpdateLectureContentRequest } from '@/entities/lecture-content/types/backend';
import { PlusIcon, PencilIcon, TrashIcon, PlayIcon, DocumentIcon } from '@heroicons/react/24/outline';
import Modal from '@/shared/ui/Modal';

export default function LectureContentManagement() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const lectureIdNum = lectureId ? parseInt(lectureId) : 0;
  
  const { data: contents, isLoading } = useLectureContents(lectureIdNum);
  const createMutation = useCreateLectureContent();
  const updateMutation = useUpdateLectureContent();
  const deleteMutation = useDeleteLectureContent();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<LectureContentResponse | null>(null);
  const [formData, setFormData] = useState({
    sessionNumber: '',
    title: '',
    description: '',
    videoUrl: '',
    videoDuration: '',
    materialUrl: '',
    materialFileName: '',
    notes: '',
    learningObjectives: '',
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleCreate = () => {
    setFormData({
      sessionNumber: '',
      title: '',
      description: '',
      videoUrl: '',
      videoDuration: '',
      materialUrl: '',
      materialFileName: '',
      notes: '',
      learningObjectives: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (content: LectureContentResponse) => {
    setFormData({
      sessionNumber: content.sessionNumber.toString(),
      title: content.title,
      description: content.description || '',
      videoUrl: content.videoUrl || '',
      videoDuration: content.videoDuration?.toString() || '',
      materialUrl: content.materialUrl || '',
      materialFileName: content.materialFileName || '',
      notes: content.notes || '',
      learningObjectives: content.learningObjectives || '',
    });
    setEditingContent(content);
  };

  const handleDelete = async (contentId: number) => {
    if (confirm('정말 이 회차를 삭제하시겠습니까?')) {
      await deleteMutation.mutateAsync({ contentId, lectureId: lectureIdNum });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContent) {
      const updateRequest: UpdateLectureContentRequest = {
        title: formData.title,
        description: formData.description || undefined,
        videoUrl: formData.videoUrl || undefined,
        videoDuration: formData.videoDuration ? parseInt(formData.videoDuration) : undefined,
        materialUrl: formData.materialUrl || undefined,
        materialFileName: formData.materialFileName || undefined,
        notes: formData.notes || undefined,
        learningObjectives: formData.learningObjectives || undefined,
      };
      await updateMutation.mutateAsync({ contentId: editingContent.contentId, request: updateRequest });
      setEditingContent(null);
    } else {
      const createRequest: CreateLectureContentRequest = {
        lectureId: lectureIdNum,
        sessionNumber: parseInt(formData.sessionNumber),
        title: formData.title,
        description: formData.description || undefined,
        videoUrl: formData.videoUrl || undefined,
        videoDuration: formData.videoDuration ? parseInt(formData.videoDuration) : undefined,
        materialUrl: formData.materialUrl || undefined,
        materialFileName: formData.materialFileName || undefined,
        notes: formData.notes || undefined,
        learningObjectives: formData.learningObjectives || undefined,
      };
      await createMutation.mutateAsync(createRequest);
      setIsCreateModalOpen(false);
    }
    setFormData({
      sessionNumber: '',
      title: '',
      description: '',
      videoUrl: '',
      videoDuration: '',
      materialUrl: '',
      materialFileName: '',
      notes: '',
      learningObjectives: '',
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">강의 회차 관리</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          회차 추가
        </button>
      </div>

      {contents && contents.length > 0 ? (
        <div className="space-y-4">
          {contents.map((content) => (
            <div key={content.contentId} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {content.sessionNumber}회차: {content.title}
                  </h3>
                  {content.description && (
                    <p className="text-sm text-gray-600 mt-1">{content.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(content.contentId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {content.videoUrl && (
                  <div className="flex items-center gap-2">
                    <PlayIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">영상:</span>
                    <a href={content.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {content.videoUrl}
                    </a>
                    {content.videoDuration && (
                      <span className="text-gray-500">({formatDuration(content.videoDuration)})</span>
                    )}
                  </div>
                )}
                {content.materialUrl && (
                  <div className="flex items-center gap-2">
                    <DocumentIcon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">자료:</span>
                    <a href={content.materialUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      {content.materialFileName || content.materialUrl}
                    </a>
                  </div>
                )}
                {content.learningObjectives && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">학습 목표:</span>
                    <p className="text-gray-600 mt-1">{content.learningObjectives}</p>
                  </div>
                )}
                {content.notes && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">강의 노트:</span>
                    <p className="text-gray-600 mt-1 whitespace-pre-wrap">{content.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          등록된 회차가 없습니다. 회차를 추가해주세요.
        </div>
      )}

      {/* 회차 생성/수정 모달 */}
      {(isCreateModalOpen || editingContent) && (
        <Modal onClose={() => {
          setIsCreateModalOpen(false);
          setEditingContent(null);
          setFormData({
            sessionNumber: '',
            title: '',
            description: '',
            videoUrl: '',
            videoDuration: '',
            materialUrl: '',
            materialFileName: '',
            notes: '',
            learningObjectives: '',
          });
        }}>
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingContent ? '회차 수정' : '회차 추가'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingContent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회차 번호 *
                  </label>
                  <input
                    type="number"
                    value={formData.sessionNumber}
                    onChange={(e) => setFormData({ ...formData, sessionNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  회차 제목 *
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
                  회차 설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    영상 URL
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    재생 시간 (초)
                  </label>
                  <input
                    type="number"
                    value={formData.videoDuration}
                    onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    자료 URL
                  </label>
                  <input
                    type="url"
                    value={formData.materialUrl}
                    onChange={(e) => setFormData({ ...formData, materialUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    자료 파일명
                  </label>
                  <input
                    type="text"
                    value={formData.materialFileName}
                    onChange={(e) => setFormData({ ...formData, materialFileName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학습 목표
                </label>
                <textarea
                  value={formData.learningObjectives}
                  onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="이번 회차에서 학습할 목표를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  강의 노트/요약
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="강의 내용 요약이나 노트를 입력하세요"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingContent ? '수정' : '생성'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingContent(null);
                    setFormData({
                      sessionNumber: '',
                      title: '',
                      description: '',
                      videoUrl: '',
                      videoDuration: '',
                      materialUrl: '',
                      materialFileName: '',
                      notes: '',
                      learningObjectives: '',
                    });
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


