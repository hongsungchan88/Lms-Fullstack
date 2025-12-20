import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoardPosts, createBoardPost, getComments, createComment } from '@/entities/board/apis';
import { LoadingSpinner } from '@/shared';
import { Header } from '@/widgets';
import type { BoardPostResponse, CommentResponse, CreateBoardPostRequest, CreateCommentRequest } from '@/entities/board/types/backend';
import { PlusIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
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

export default function LectureBoard() {
  const { id: lectureId } = useParams<{ id: string }>();
  const lectureIdNum = lectureId ? parseInt(lectureId) : 0;
  const queryClient = useQueryClient();
  const user = getUserFromStorage();

  const [category, setCategory] = useState<string>('ALL');
  const [selectedPost, setSelectedPost] = useState<BoardPostResponse | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postFormData, setPostFormData] = useState({ title: '', content: '', postCategory: 'GENERAL' });
  const [commentData, setCommentData] = useState<{ [key: number]: string }>({});

  const { data: posts, isLoading } = useQuery({
    queryKey: ['boardPosts', lectureIdNum, category],
    queryFn: () => {
      if (category === 'ALL') {
        return getBoardPosts(lectureIdNum);
      }
      return getBoardPosts(lectureIdNum, category);
    },
    enabled: !!lectureIdNum,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', selectedPost?.postId],
    queryFn: () => getComments(selectedPost!.postId),
    enabled: !!selectedPost,
  });

  const createPostMutation = useMutation({
    mutationFn: (request: CreateBoardPostRequest) => createBoardPost(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardPosts', lectureIdNum] });
      setIsCreateModalOpen(false);
      setPostFormData({ title: '', content: '', postCategory: 'GENERAL' });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, request }: { postId: number; request: CreateCommentRequest }) =>
      createComment(postId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      setCommentData({ ...commentData, [variables.postId]: '' });
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    const request: CreateBoardPostRequest = {
      title: postFormData.title,
      content: postFormData.content,
      author: user.name || user.nickname,
      lectureId: lectureIdNum,
      category: postFormData.postCategory,
      authorRole: user.role,
    };
    await createPostMutation.mutateAsync(request);
  };

  const handleCreateComment = async (postId: number) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    const content = commentData[postId];
    if (!content) {
      alert('댓글 내용을 입력하세요.');
      return;
    }
    const request: CreateCommentRequest = {
      content,
      author: user.name || user.nickname,
      authorRole: user.role,
    };
    await createCommentMutation.mutateAsync({ postId, request });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">게시판</h2>
        <div className="flex gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">전체</option>
            <option value="NOTICE">공지사항</option>
            <option value="QNA">Q&A</option>
            <option value="GENERAL">일반</option>
          </select>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            글쓰기
          </button>
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.postId} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      post.category === 'NOTICE' ? 'bg-red-100 text-red-800' :
                      post.category === 'QNA' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.category === 'NOTICE' ? '공지' : post.category === 'QNA' ? 'Q&A' : '일반'}
                    </span>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    작성자: {post.author} ({post.authorRole}) | {new Date(post.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPost(selectedPost?.postId === post.postId ? null : post)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {selectedPost?.postId === post.postId ? '접기' : '댓글'}
                </button>
              </div>

              <div className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</div>

              {post.attachmentUrl && (
                <a
                  href={post.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  첨부파일 다운로드
                </a>
              )}

              {selectedPost?.postId === post.postId && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    댓글 ({comments?.length || 0})
                  </h4>
                  <div className="space-y-3 mb-4">
                    {comments && comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.commentId} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{comment.author} ({comment.authorRole})</p>
                              <p className="text-gray-700 mt-1">{comment.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(comment.createdAt).toLocaleString('ko-KR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">댓글이 없습니다.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="댓글을 입력하세요..."
                      value={commentData[post.postId] || ''}
                      onChange={(e) => setCommentData({ ...commentData, [post.postId]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateComment(post.postId);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleCreateComment(post.postId)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      disabled={createCommentMutation.isPending}
                    >
                      등록
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          게시글이 없습니다.
        </div>
      )}

      {/* 게시글 작성 모달 */}
      {isCreateModalOpen && (
        <Modal onClose={() => {
          setIsCreateModalOpen(false);
          setPostFormData({ title: '', content: '', postCategory: 'GENERAL' });
        }}>
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">게시글 작성</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={postFormData.postCategory}
                  onChange={(e) => setPostFormData({ ...postFormData, postCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GENERAL">일반</option>
                  <option value="NOTICE">공지사항</option>
                  <option value="QNA">Q&A</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <input
                  type="text"
                  value={postFormData.title}
                  onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                <textarea
                  value={postFormData.content}
                  onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={10}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={createPostMutation.isPending}
                >
                  작성
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setPostFormData({ title: '', content: '', postCategory: 'GENERAL' });
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
    </>
  );
}


