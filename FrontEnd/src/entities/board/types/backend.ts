export interface BoardPostResponse {
  postId: number;
  title: string;
  content: string;
  author: string;
  attachmentUrl?: string;
  lectureId?: number;
  lectureTitle?: string;
  category?: string;
  authorRole?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardPostRequest {
  title: string;
  content: string;
  author: string;
  attachmentUrl?: string;
  lectureId?: number;
  category?: string;
  authorRole?: string;
}

export interface UpdateBoardPostRequest {
  title: string;
  content: string;
  attachmentUrl?: string;
}

export interface CommentResponse {
  commentId: number;
  postId: number;
  content: string;
  author: string;
  authorRole?: string;
  parentCommentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  author: string;
  authorRole?: string;
  parentCommentId?: number;
}


