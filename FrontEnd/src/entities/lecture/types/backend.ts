// 백엔드 API 응답 타입
export interface LectureResponse {
  lectureId: number;
  title: string;
  instructorNumber: number;
  instructorName: string;
  totalLecture: number | null;
  category: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLectureRequest {
  title: string;
  instructorNumber: number;
  totalLecture?: number;
  category?: string;
  thumbnailUrl?: string;
}

export interface UpdateLectureRequest {
  title: string;
  totalLecture?: number;
  category?: string;
  thumbnailUrl?: string;
}


