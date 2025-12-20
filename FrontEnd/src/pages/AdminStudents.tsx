import { useState } from 'react';
import { useAllStudents } from '@/features/student/model';
import { LoadingSpinner } from '@/shared';
import type { StudentResponse } from '@/entities/student/apis';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '@/shared/ui/Modal';
import { useCreateStudent, useUpdateStudent, useDeleteStudent } from '@/features/admin/model';

export default function AdminStudents() {
  const { data: students, isLoading } = useAllStudents();
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(null);
  const [formData, setFormData] = useState({
    studentNumber: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    departmentsId: 1,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const filteredStudents = students?.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentNumber.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = () => {
    setFormData({ studentNumber: '', password: '', name: '', email: '', phone: '', departmentsId: 1 });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (student: StudentResponse) => {
    setFormData({
      studentNumber: student.studentNumber,
      password: '',
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      departmentsId: student.departmentsId,
    });
    setEditingStudent(student);
  };

  const handleDelete = async (studentNumber: string) => {
    if (confirm('정말 이 학생을 삭제하시겠습니까?')) {
      await deleteMutation.mutateAsync(studentNumber);
    }
  };

  // 전화번호 포맷팅 함수 (01011112222 -> 010-1111-2222)
  // 백엔드 패턴: ^(01[016789])-?([0-9]{3,4})-?([0-9]{4})$
  const formatPhoneNumber = (phone: string): string | undefined => {
    if (!phone || !phone.trim()) return undefined;
    
    // 숫자만 추출
    const numbers = phone.replace(/\D/g, '');
    
    // 010, 011, 016, 017, 018, 019로 시작하는 11자리 번호인 경우
    if (numbers.length === 11 && /^01[016789]/.test(numbers)) {
      // 010-1111-2222 형식으로 변환 (3-4-4)
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
    
    // 이미 하이픈이 있으면 그대로 반환 (패턴에 맞는지 확인)
    if (phone.includes('-')) {
      return phone;
    }
    
    // 그 외의 경우는 undefined 반환 (선택적 필드이므로)
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 전화번호 포맷팅
      const formattedPhone = formatPhoneNumber(formData.phone);
      
      if (editingStudent) {
        await updateMutation.mutateAsync({
          studentNumber: formData.studentNumber,
          request: {
            name: formData.name,
            email: formData.email,
            phone: formattedPhone,
          },
        });
        setEditingStudent(null);
        alert('학생 정보가 수정되었습니다.');
      } else {
        await createMutation.mutateAsync({
          studentNumber: formData.studentNumber,
          password: formData.password,
          name: formData.name,
          email: formData.email,
          phone: formattedPhone,
          departmentsId: formData.departmentsId,
        });
        setIsCreateModalOpen(false);
        alert('학생이 추가되었습니다.');
      }
      setFormData({ studentNumber: '', password: '', name: '', email: '', phone: '', departmentsId: 1 });
    } catch (error: any) {
      console.error('학생 생성/수정 오류:', error);
      // 에러 메시지는 createStudent에서 이미 파싱되어 Error 객체로 throw됨
      const errorMessage = error?.message || '학생 생성/수정 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">학생 관리</h2>
          <p className="text-gray-600 text-sm mt-1">학생 정보를 조회하고 관리할 수 있습니다</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 학번, 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium whitespace-nowrap"
          >
            <PlusIcon className="w-5 h-5" />
            학생 추가
          </button>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">학번</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">이름</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">이메일</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">전화번호</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">학과</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents.map((student, index) => (
                  <tr key={student.studentNumber} className="hover:bg-blue-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{student.studentNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{student.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{student.phone || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.departmentName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-150"
                          title="수정"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.studentNumber)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                          title="삭제"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl shadow-md border border-gray-100 text-center">
          <div className="text-gray-400 mb-2">
            <UserGroupIcon className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
          </p>
        </div>
      )}

      {/* 생성/수정 모달 */}
      {(isCreateModalOpen || editingStudent) && (
        <Modal onClose={() => {
          setIsCreateModalOpen(false);
          setEditingStudent(null);
          setFormData({ studentNumber: '', password: '', name: '', email: '', phone: '', departmentsId: 1 });
        }}>
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{editingStudent ? '학생 수정' : '학생 추가'}</h3>
              <p className="text-sm text-gray-500">학생 정보를 입력해주세요</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">학번 *</label>
                <input
                  type="text"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  required
                  disabled={!!editingStudent}
                />
              </div>
              {!editingStudent && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호 *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">이메일 *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">전화번호</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  placeholder="010-1234-5678"
                />
              </div>
              {!editingStudent && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">학과 ID *</label>
                  <input
                    type="number"
                    value={formData.departmentsId}
                    onChange={(e) => setFormData({ ...formData, departmentsId: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                    min="1"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingStudent ? '수정하기' : '생성하기'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingStudent(null);
                    setFormData({ studentNumber: '', password: '', name: '', email: '', phone: '', departmentsId: 1 });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}


