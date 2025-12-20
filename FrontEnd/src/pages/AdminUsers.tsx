import { useState } from 'react';
import { useAllStudents } from '@/features/student/model';
import { useAllInstructors } from '@/features/admin/model';
import { LoadingSpinner } from '@/shared';
import type { StudentResponse } from '@/entities/student/apis';
import type { InstructorResponse } from '@/entities/admin/apis/getAllInstructors';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type UserType = 'ALL' | 'STUDENT' | 'TEACHER';

export default function AdminUsers() {
  const { data: students, isLoading: studentsLoading } = useAllStudents();
  const { data: instructors, isLoading: instructorsLoading } = useAllInstructors();
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState<UserType>('ALL');

  const isLoading = studentsLoading || instructorsLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 학생 데이터에 역할 추가
  const studentsWithRole = (students || []).map((student) => ({
    ...student,
    role: 'STUDENT' as const,
    identifier: student.studentNumber,
    identifierLabel: '학번',
  }));

  // 교사 데이터에 역할 추가
  const instructorsWithRole = (instructors || []).map((instructor) => ({
    ...instructor,
    role: 'TEACHER' as const,
    identifier: String(instructor.instructorNumber),
    identifierLabel: '교사번호',
  }));

  // 모든 사용자 합치기
  const allUsers = [...studentsWithRole, ...instructorsWithRole];

  // 필터링
  const filteredUsers = allUsers.filter((user) => {
    // 역할 필터
    if (userType !== 'ALL' && user.role !== userType) {
      return false;
    }

    // 검색어 필터
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.identifier.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">학생</span>;
      case 'TEACHER':
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">교사</span>;
      case 'ADMIN':
        return <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">관리자</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">회원 관리</h2>
        <div className="flex gap-4">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">전체</option>
            <option value="STUDENT">학생</option>
            <option value="TEACHER">교사</option>
          </select>
          <div className="relative w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 학번/교사번호, 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번/교사번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전화번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학과</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={`${user.role}-${user.identifier}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.identifier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role === 'STUDENT' ? (user as StudentResponse & { role: 'STUDENT' }).departmentName : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          {searchTerm || userType !== 'ALL' ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.'}
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="text-sm text-gray-600">
          총 {filteredUsers.length}명의 회원이 조회되었습니다.
          {userType === 'ALL' && (
            <>
              {' '}(학생: {studentsWithRole.length}명, 교사: {instructorsWithRole.length}명)
            </>
          )}
        </div>
      )}
    </div>
  );
}

