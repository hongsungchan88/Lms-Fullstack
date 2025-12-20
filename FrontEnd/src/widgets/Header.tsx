import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { lectureQueries } from '@/entities/lecture';
import clsx from 'clsx';

export default function Header() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const lectureId = id ? parseInt(id || '0') : 0;
  
  const { data: lecture } = useQuery(lectureQueries.lectureDetail(lectureId));
  
  const handleBack = () => {
    navigate(-1);
  };

  const lecturePath = `/lecture/${id}`;
  const boardPath = `/lecture/${id}/board`;
  const contentsPath = `/lecture/${id}/contents`;
  const noticePath = `/lecture/${id}/notice`;

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/95">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex justify-between items-center">
          <div className="h-full flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              <Link to={lecturePath} className="hover:text-gray-900 transition-colors">
                {lecture?.title || '강의'}
              </Link>
            </h1>
            <nav className="hidden md:flex items-center gap-2 ml-8 h-full">
              <Link
                to={lecturePath}
                className={clsx(
                  'px-4 py-2 h-full flex items-center justify-center rounded-lg transition-all duration-200 text-sm font-medium',
                  {
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md':
                      pathname === lecturePath,
                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900':
                      pathname !== lecturePath,
                  },
                )}
              >
                강의
              </Link>
              <Link
                to={contentsPath}
                className={clsx(
                  'px-4 py-2 h-full flex items-center justify-center rounded-lg transition-all duration-200 text-sm font-medium',
                  {
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md':
                      pathname === contentsPath,
                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900':
                      pathname !== contentsPath,
                  },
                )}
              >
                회차
              </Link>
              <Link
                to={`/lecture/${id}/assignments`}
                className={clsx(
                  'px-4 py-2 h-full flex items-center justify-center rounded-lg transition-all duration-200 text-sm font-medium',
                  {
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md':
                      pathname === `/lecture/${id}/assignments`,
                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900':
                      pathname !== `/lecture/${id}/assignments`,
                  },
                )}
              >
                과제
              </Link>
              <Link
                to={boardPath}
                className={clsx(
                  'px-4 py-2 h-full flex items-center justify-center rounded-lg transition-all duration-200 text-sm font-medium',
                  {
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md':
                      pathname === boardPath,
                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900':
                      pathname !== boardPath,
                  },
                )}
              >
                게시판
              </Link>
              <Link
                to={noticePath}
                className={clsx(
                  'px-4 py-2 h-full flex items-center justify-center rounded-lg transition-all duration-200 text-sm font-medium',
                  {
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md':
                      pathname === noticePath,
                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900':
                      pathname !== noticePath,
                  },
                )}
              >
                공지사항
              </Link>
            </nav>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-shadow" />
        </div>
      </div>
    </header>
  );
}
