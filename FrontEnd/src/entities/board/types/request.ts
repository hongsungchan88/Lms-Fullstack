export interface CreatePostRequest {
  title?: string;
  content: string;
  authorId: string;
  author: string;
  lectureId?: number;
  category?: string;
  authorRole?: string;
}

export interface EditPostRequest extends CreatePostRequest {
  id: number;
}
