import { api } from '@/shared';
import type { Course } from '@/entities/course/types';
import type { User } from '@/entities/user/types';

interface StudentLectureResponse {
  studentLectureId: number;
  studentNumber: string;
  lectureId: number;
  createdAt: string;
  title: string;
  instructorName: string;
  category: string;
  progress: number | null;
  currentLecture: number | null;
  totalLecture: number | null;
  nextLectureTitle: string | null;
  thumbnailUrl: string | null;
}

export default async function getCourse(): Promise<Course[]> {
  // 로컬 스토리지에서 사용자 정보 가져오기
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    throw new Error('로그인이 필요합니다.');
  }

  let user: User;
  try {
    user = JSON.parse(storedUser);
  } catch (e) {
    throw new Error('사용자 정보를 불러올 수 없습니다.');
  }

  const studentNumber = user.studentNumber;
  
  if (!studentNumber) {
    throw new Error('학생 정보를 찾을 수 없습니다.');
  }
  
  // studentNumber를 쿼리 파라미터로 전달
  const response = await api
    .get('my-classroom/courses', {
      searchParams: { studentNumber }
    })
    .json<StudentLectureResponse[]>();
  
  // 백엔드 응답을 프론트엔드 형식으로 변환
  return response.map(item => ({
    id: item.studentLectureId,
    lectureId: item.lectureId, // 강의 상세 페이지로 이동하기 위한 강의 ID
    title: item.title,
    instructor: item.instructorName,
    category: item.category,
    progress: item.progress ?? 0,
    currentLecture: item.currentLecture ?? 0,
    totalLecture: item.totalLecture ?? 0,
    nextLectureTitle: item.nextLectureTitle ?? '',
    thumbnailUrl: item.thumbnailUrl ?? '',
  }));
}
