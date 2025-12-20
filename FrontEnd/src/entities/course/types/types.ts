export interface Course {
  id: number;
  lectureId: number; // 강의 상세 페이지로 이동하기 위한 강의 ID
  title: string;
  instructor: string;
  category: string;
  progress: number;
  currentLecture: number;
  totalLecture: number;
  nextLectureTitle: string;
  thumbnailUrl: string;
}
