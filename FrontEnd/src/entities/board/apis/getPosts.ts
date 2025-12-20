import { api } from '@/shared';
import type { Post } from '@/entities/board';
import type { BoardPostResponse } from '../types/backend';

// 기존 Post 타입으로 변환하는 헬퍼 함수
const convertToPost = (post: BoardPostResponse): Post => ({
  id: post.postId,
  author: post.author,
  authorId: post.author,
  avatar: `https://i.pravatar.cc/150?u=${post.author}`,
  content: post.content,
  imageUrl: post.attachmentUrl ? [post.attachmentUrl] : null,
  likes: 0, // 백엔드에 좋아요 기능이 없으므로 0
  comments: 0, // 댓글 수는 별도로 조회해야 함
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

export const getPosts = async (lectureId?: number, category?: string): Promise<Post[]> => {
  let response: BoardPostResponse[];
  if (lectureId && category) {
    response = await api.get(`board/posts/lecture/${lectureId}/category/${category}`).json<BoardPostResponse[]>();
  } else if (lectureId) {
    response = await api.get(`board/posts/lecture/${lectureId}`).json<BoardPostResponse[]>();
  } else {
    response = await api.get('board/posts').json<BoardPostResponse[]>();
  }
  return response.map(convertToPost);
};
