import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBoardPosts } from '@/entities/board/apis';
import { LoadingSpinner } from '@/shared';
import { Header } from '@/widgets';
import type { BoardPostResponse } from '@/entities/board/types/backend';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function LectureNotice() {
  const { id: lectureId } = useParams<{ id: string }>();
  const lectureIdNum = lectureId ? parseInt(lectureId) : 0;
  const [selectedPost, setSelectedPost] = useState<BoardPostResponse | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['boardPosts', lectureIdNum, 'NOTICE'],
    queryFn: () => getBoardPosts(lectureIdNum, 'NOTICE'),
    enabled: !!lectureIdNum,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold">공지사항</h2>
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.postId} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                        공지
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
                    {selectedPost?.postId === post.postId ? '접기' : '자세히'}
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
                    <div className="text-sm text-gray-600">
                      <p>작성일: {new Date(post.createdAt).toLocaleString('ko-KR')}</p>
                      {post.updatedAt && post.updatedAt !== post.createdAt && (
                        <p>수정일: {new Date(post.updatedAt).toLocaleString('ko-KR')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
            등록된 공지사항이 없습니다.
          </div>
        )}
      </div>
    </>
  );
}

