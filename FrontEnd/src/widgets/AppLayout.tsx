import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { PAGES, TEACHER_PAGES, ADMIN_PAGES } from '@/shared/constants/pages';
import Sidebar from './Sidebar';
import type { User } from '@/entities/user/types';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children?: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useOutletContext<User | undefined>();

  // 역할에 따라 다른 페이지 목록 사용
  const pages = user?.role === 'ADMIN' ? ADMIN_PAGES : user?.role === 'TEACHER' ? TEACHER_PAGES : PAGES;
  const currentPage = pages.find(page => page.path === currentPath);
  const title = currentPage?.label;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          {children || <Outlet context={user} />}
        </div>
      </main>
    </div>
  );
}
