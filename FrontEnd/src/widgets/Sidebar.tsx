import { useLocation, Link, useNavigate, useOutletContext } from 'react-router-dom';
import clsx from 'clsx';
import { PAGES, TEACHER_PAGES, ADMIN_PAGES } from '@/shared/constants/pages';
import { useQueryClient } from '@tanstack/react-query';
import { createUserKey } from '@/shared';
import { postLogout } from '@/entities/user/apis';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import type { User } from '@/entities/user';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useOutletContext<User | undefined>();

  const handleLogout = async () => {
    try {
      // 먼저 로컬 스토리지와 쿼리 캐시 정리
      localStorage.removeItem('user');
      queryClient.setQueryData(createUserKey(), { data: null });
      
      // API 호출 (실패해도 무시)
      try {
        await postLogout();
      } catch (error) {
        console.error('로그아웃 API 호출 실패 (무시됨):', error);
      }
      
      // 로그인 페이지로 이동
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      // 에러가 발생해도 로그인 페이지로 이동
      localStorage.removeItem('user');
      queryClient.setQueryData(createUserKey(), { data: null });
      navigate('/login', { replace: true });
    }
  };

  // user가 없으면 빈 사이드바 반환 (안전장치)
  if (!user) {
    return null;
  }

      const pages = user.role === 'ADMIN' ? ADMIN_PAGES : user.role === 'TEACHER' ? TEACHER_PAGES : PAGES;

  return (
    <aside className="w-[280px] h-screen bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 flex flex-col shadow-lg">
      <Link to="/" className="flex items-center gap-3 p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
          <img src="/logo.svg" alt="LemoHub Logo" className="w-8 h-8" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LemoHub</span>
      </Link>
      <ul className="space-y-1 p-4 flex-1 overflow-y-auto">
        {pages.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');

          return (
            <li key={path}>
              <Link
                to={path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600',
                )}
              >
                <Icon className={clsx('w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="mb-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="text-xs font-medium text-gray-500 mb-1">현재 사용자</div>
          <div className="text-sm font-semibold text-gray-800">
            {user.name || user.nickname}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {user.role === 'STUDENT' ? '학생' : user.role === 'TEACHER' ? '교사' : '관리자'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-gray-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
