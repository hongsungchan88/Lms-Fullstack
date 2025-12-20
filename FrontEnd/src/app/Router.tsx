import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Layout from '@/widgets/AppLayout';
import {
  LoginPage,
  RegisterPage,
  LectureDetail,
  MyClassroom,
  Schedule,
  Progress,
  Instructors,
  Achievements,
  Settings,
  Assignment,
  Enrollment,
  Board,
  TeacherDashboard,
  TeacherLectures,
  TeacherStudents,
  AdminDashboard,
  AdminStudents,
  AdminInstructors,
  AdminUsers,
  AdminLectures,
  LectureContentManagement,
  LectureContents,
  LectureBoard,
  LectureNotice,
  TeacherNotice,
  TeacherAssignments,
  StudentAssignments,
} from '@/pages';
import RequireAuth from '@/app/RequireAuth';
import RoleBasedRoute from '@/components/RoleBasedRoute';
import RoleBasedDashboard from '@/components/RoleBasedDashboard';
import { LoadingSpinner } from '@/shared';
import { Suspense } from 'react';
import { lectureListLoader } from '@/entities/lecture';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { userLoader } from '@/entities/user/lib';

const createRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/',
      element: <RequireAuth />,
      loader: () => userLoader(queryClient),
      children: [
        // 루트 경로 - 역할에 따라 다른 대시보드 렌더링
        {
          index: true,
          element: (
            <RoleBasedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
              <Layout>
                <RoleBasedDashboard />
              </Layout>
            </RoleBasedRoute>
          ),
        },
        // ADMIN 전용 라우트
        {
          element: (
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <Outlet />
              </Layout>
            </RoleBasedRoute>
          ),
          children: [
            { path: 'admin/users', element: <AdminUsers /> },
            { path: 'admin/students', element: <AdminStudents /> },
            { path: 'admin/instructors', element: <AdminInstructors /> },
            { path: 'admin/lectures', element: <AdminLectures /> },
            { path: 'settings', element: <Settings /> },
          ],
        },
        // TEACHER 전용 라우트
        {
          path: 'teacher',
          element: (
            <RoleBasedRoute allowedRoles={['TEACHER']}>
              <Layout>
                <Outlet />
              </Layout>
            </RoleBasedRoute>
          ),
          children: [
            { path: 'lectures', element: <TeacherLectures /> },
            { path: 'lectures/:lectureId/contents', element: <LectureContentManagement /> },
            { path: 'lectures/:lectureId/assignments', element: <TeacherAssignments /> },
            { path: 'lectures/:lectureId/notice', element: <TeacherNotice /> },
            { path: 'students', element: <TeacherStudents /> },
          ],
        },
        // STUDENT 전용 라우트
        {
          element: (
            <RoleBasedRoute allowedRoles={['STUDENT']}>
              <Layout>
                <Outlet />
              </Layout>
            </RoleBasedRoute>
          ),
          children: [
            { path: 'schedule', element: <Schedule /> },
            { path: 'progress', element: <Progress /> },
            { path: 'instructors', element: <Instructors /> },
            { path: 'achievements', element: <Achievements /> },
            { path: 'enrollment', element: <Enrollment /> },
            { path: 'settings', element: <Settings /> },
            {
              path: 'lecture/:id',
              element: <LectureDetail />,
              loader: ({ params }) =>
                lectureListLoader({
                  id: Number(params.id),
                  queryClient,
                }),
            },
            {
              path: 'lecture/:id/assignments',
              element: <StudentAssignments />,
            },
            {
              path: 'lecture/:id/assignments/:assignmentId',
              element: <Assignment />,
            },
            {
              path: 'lecture/:id/board',
              element: <LectureBoard />,
            },
            {
              path: 'lecture/:id/contents',
              element: <LectureContents />,
            },
            {
              path: 'lecture/:id/notice',
              element: <LectureNotice />,
            },
          ],
        },
      ],
    },
  ]);
};

export default function Router() {
  const queryClient = useQueryClient();
  return (
    <Suspense
      fallback={
        <LoadingSpinner className="fixed inset-0 flex justify-center items-center bg-white/60 z-50" />
      }
    >
      <RouterProvider router={createRouter(queryClient)} />
    </Suspense>
  );
}
