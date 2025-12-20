import { api } from '@/shared';
import type { Kpi } from '@/entities/kpi/types';
import type { User } from '@/entities/user/types';

interface KpiResponse {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
}

export default async function getKpiData(): Promise<Kpi[]> {
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
  const response = await api.get('my-classroom/kpis', {
    searchParams: { studentNumber }
  }).json<KpiResponse>();
  
  // 백엔드 응답을 프론트엔드 형식으로 변환
  // ICON_MAP에 정의된 키를 사용해야 함: '진행한 강의', '완료한 강의', '학습 시간', '제출한 과제'
  return [
    {
      id: 'completed',
      title: '완료한 강의',
      value: response.completedCourses,
      diff: 0, // 이전 달 대비는 추후 구현
    },
    {
      id: 'inProgress',
      title: '진행한 강의',
      value: response.inProgressCourses,
      diff: 0,
    },
    {
      id: 'total',
      title: '학습 시간',
      value: response.totalCourses,
      diff: 0,
    },
  ];
}
