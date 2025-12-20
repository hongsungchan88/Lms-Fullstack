import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoardPosts, createBoardPost } from '@/entities/board/apis';
import { LoadingSpinner } from '@/shared';
import type { BoardPostResponse, CreateBoardPostRequest } from '@/entities/board/types/backend';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
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

export default function TeacherNotice() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const lectureIdNum = lectureId ? parseInt(lectureId) : 0;
  const queryClient = useQueryClient();
  const user = getUserFromStorage();

  const { data: notices, isLoading } = useQuery({
    queryKey: ['boardPosts', lectureIdNum, 'NOTICE'],
    queryFn: () => getBoardPosts(lectureIdNum, 'NOTICE'),
    enabled: !!lectureIdNum,
  });

  const createMutation = useMutation({
    mutationFn: (request: CreateBoardPostRequest) => createBoardPost(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardPosts', lectureIdNum, 'NOTICE'] });
      setIsCreateModalOpen(false);
      setFormData({ title: '', content: '' });
    },
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleCreate = () => {
    setFormData({ title: '', content: '' });
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    const request: CreateBoardPostRequest = {
      title: formData.title,
      content: formData.content,
      author: user.name || user.nickname,
      lectureId: lectureIdNum,
      category: 'NOTICE',
      authorRole: user.role,
    };
    await createMutation.mutateAsync(request);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">공지사항 관리</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          공지사항 작성
        </button>
      </div>

      {notices && notices.length > 0 ? (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.postId} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                      공지
                    </span>
                    <h3 className="text-lg font-semibold">{notice.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    작성일: {new Date(notice.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap">{notice.content}</div>
              {notice.attachmentUrl && (
                <a
                  href={notice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                >
                  첨부파일 다운로드
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          등록된 공지사항이 없습니다. 공지사항을 작성해주세요.
        </div>
      )}

      {/* 공지사항 작성 모달 */}
      {isCreateModalOpen && (
        <Modal onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ title: '', content: '' });
        }}>
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">공지사항 작성</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={10}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={createMutation.isPending}
                >
                  작성
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({ title: '', content: '' });
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

