import { useState } from 'react';
import { LoadingSpinner } from '@/shared';
import Modal from '@/shared/ui/Modal';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAllInstructors, useCreateInstructor, useUpdateInstructor, useDeleteInstructor } from '@/features/admin/model';

export default function AdminInstructors() {
  const { data: instructors, isLoading } = useAllInstructors();
  const createMutation = useCreateInstructor();
  const updateMutation = useUpdateInstructor();
  const deleteMutation = useDeleteInstructor();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<any>(null);
  const [formData, setFormData] = useState({
    instructorNumber: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const filteredInstructors = instructors?.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(instructor.instructorNumber).includes(searchTerm) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = () => {
    setFormData({ instructorNumber: '', password: '', name: '', email: '', phone: '' });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (instructor: any) => {
    setFormData({
      instructorNumber: String(instructor.instructorNumber),
      password: '',
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone || '',
    });
    setEditingInstructor(instructor);
  };

  const handleDelete = async (instructorNumber: number) => {
    if (confirm('정말 이 교사를 삭제하시겠습니까?')) {
      await deleteMutation.mutateAsync(instructorNumber);
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
      
      if (editingInstructor) {
        await updateMutation.mutateAsync({
          instructorNumber: Number(formData.instructorNumber),
          request: { name: formData.name, email: formData.email, phone: formattedPhone },
        });
        setEditingInstructor(null);
        alert('교사 정보가 수정되었습니다.');
      } else {
        await createMutation.mutateAsync({
          instructorNumber: Number(formData.instructorNumber),
          password: formData.password,
          name: formData.name,
          email: formData.email,
          phone: formattedPhone,
        });
        setIsCreateModalOpen(false);
        alert('교사가 추가되었습니다.');
      }
      setFormData({ instructorNumber: '', password: '', name: '', email: '', phone: '' });
    } catch (error: any) {
      console.error('교사 생성/수정 오류:', error);
      // 에러 메시지는 createInstructor에서 이미 파싱되어 Error 객체로 throw됨
      const errorMessage = error?.message || '교사 생성/수정 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">교사 관리</h2>
          <p className="text-gray-600 text-sm mt-1">교사 정보를 조회하고 관리할 수 있습니다</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 교사번호, 이메일로 검색..."
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
            교사 추가
          </button>
        </div>
      </div>

      {filteredInstructors.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">교사번호</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">이름</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">이메일</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">전화번호</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor.instructorNumber} className="hover:bg-blue-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{instructor.instructorNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{instructor.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{instructor.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{instructor.phone || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(instructor)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-150"
                          title="수정"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(instructor.instructorNumber)}
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
            <AcademicCapIcon className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 교사가 없습니다.'}
          </p>
        </div>
      )}

      {/* 생성/수정 모달 */}
      {(isCreateModalOpen || editingInstructor) && (
        <Modal onClose={() => {
          setIsCreateModalOpen(false);
          setEditingInstructor(null);
          setFormData({ instructorNumber: '', password: '', name: '', email: '', phone: '' });
        }}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingInstructor ? '교사 수정' : '교사 추가'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">교사번호 *</label>
                <input
                  type="number"
                  value={formData.instructorNumber}
                  onChange={(e) => setFormData({ ...formData, instructorNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!!editingInstructor}
                />
              </div>
              {!editingInstructor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingInstructor ? '수정' : '생성'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingInstructor(null);
                    setFormData({ instructorNumber: '', password: '', name: '', email: '', phone: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
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


