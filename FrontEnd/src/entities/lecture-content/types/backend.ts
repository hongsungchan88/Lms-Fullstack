export interface LectureContentResponse {
  contentId: number;
  lectureId: number;
  sessionNumber: number;
  title: string;
  description?: string;
  videoUrl?: string;
  videoDuration?: number;
  materialUrl?: string;
  materialFileName?: string;
  notes?: string;
  learningObjectives?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLectureContentRequest {
  lectureId: number;
  sessionNumber: number;
  title: string;
  description?: string;
  videoUrl?: string;
  videoDuration?: number;
  materialUrl?: string;
  materialFileName?: string;
  notes?: string;
  learningObjectives?: string;
}

export interface UpdateLectureContentRequest {
  title: string;
  description?: string;
  videoUrl?: string;
  videoDuration?: number;
  materialUrl?: string;
  materialFileName?: string;
  notes?: string;
  learningObjectives?: string;
}


