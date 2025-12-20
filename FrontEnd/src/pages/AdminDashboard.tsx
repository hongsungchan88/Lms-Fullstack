import { Link } from 'react-router-dom';
import { UserGroupIcon, AcademicCapIcon, BookOpenIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const cards = [
    {
      to: '/admin/users',
      icon: UserGroupIcon,
      title: '회원 관리',
      description: '전체 회원 조회 및 관리',
      gradient: 'from-indigo-500 to-purple-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      to: '/admin/students',
      icon: UserGroupIcon,
      title: '학생 관리',
      description: '학생 목록 조회 및 관리',
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      to: '/admin/instructors',
      icon: AcademicCapIcon,
      title: '교사 관리',
      description: '교사 목록 조회 및 관리',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      to: '/admin/lectures',
      icon: BookOpenIcon,
      title: '강의 개설',
      description: '강의 개설 및 교사 할당',
      gradient: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4">
        <p className="text-gray-600 text-lg">시스템 관리 및 모니터링</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="p-8">
                <div className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${card.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {card.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                  바로가기
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


