import { api } from '@/shared';
import type { CreatePostRequest, Post } from '@/entities/board';
import type { CreateBoardPostRequest, BoardPostResponse } from '../types/backend';

// 기존 Post 타입으로 변환하는 헬퍼 함수
const convertToPost = (post: BoardPostResponse): Post => ({
  id: post.postId,
  author: post.author,
  authorId: post.author,
  avatar: `https://i.pravatar.cc/150?u=${post.author}`,
  content: post.content,
  imageUrl: post.attachmentUrl ? [post.attachmentUrl] : null,
  likes: 0,
  comments: 0,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

export const createPost = async (data: CreatePostRequest & { lectureId?: number; category?: string }) => {
  const request: CreateBoardPostRequest = {
    title: data.title || '제목 없음',
    content: data.content,
    author: data.author,
    lectureId: data.lectureId,
    category: data.category || 'GENERAL',
    authorRole: data.authorRole,
  };
  const response = await api.post('board/posts', { json: request }).json<BoardPostResponse>();
  return convertToPost(response);
};
