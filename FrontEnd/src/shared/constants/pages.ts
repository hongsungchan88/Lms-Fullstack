import {
  BookOpenIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  PencilSquareIcon,
  UserGroupIcon,
  AcademicCapIcon as TeacherIcon,
} from '@heroicons/react/24/outline';

export const PAGES = [
  {
    key: 'home',
    label: '내 강의실',
    path: '/',
    icon: BookOpenIcon,
  },
  {
    key: 'enrollment',
    label: '수강 신청',
    path: '/enrollment',
    icon: PencilSquareIcon,
  },
  {
    key: 'settings',
    label: '환경 설정',
    path: '/settings',
    icon: Cog6ToothIcon,
  },
] as const;

export const TEACHER_PAGES = [
  {
    key: 'dashboard',
    label: '대시보드',
    path: '/',
    icon: BookOpenIcon,
  },
  {
    key: 'lectures',
    label: '강의 관리',
    path: '/teacher/lectures',
    icon: TeacherIcon,
  },
  {
    key: 'students',
    label: '학생 관리',
    path: '/teacher/students',
    icon: UserGroupIcon,
  },
  {
    key: 'settings',
    label: '환경 설정',
    path: '/settings',
    icon: Cog6ToothIcon,
  },
] as const;

export const ADMIN_PAGES = [
  {
    key: 'dashboard',
    label: '대시보드',
    path: '/',
    icon: BookOpenIcon,
  },
  {
    key: 'users',
    label: '회원 관리',
    path: '/admin/users',
    icon: UserGroupIcon,
  },
  {
    key: 'students',
    label: '학생 관리',
    path: '/admin/students',
    icon: UserGroupIcon,
  },
  {
    key: 'instructors',
    label: '교사 관리',
    path: '/admin/instructors',
    icon: AcademicCapIcon,
  },
  {
    key: 'lectures',
    label: '강의 개설',
    path: '/admin/lectures',
    icon: BookOpenIcon,
  },
  {
    key: 'settings',
    label: '환경 설정',
    path: '/settings',
    icon: Cog6ToothIcon,
  },
] as const;

export const ICON_MAP = {
  '진행한 강의': BookOpenIcon,
  '완료한 강의': ClipboardDocumentListIcon,
  '학습 시간': AcademicCapIcon,
  '제출한 과제': DocumentCheckIcon,
} as const;

export type KpiIconMap = keyof typeof ICON_MAP;
