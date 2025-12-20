export default function TeacherDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">교사 대시보드</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">내 강의</h3>
          <p className="text-gray-600">강의 관리 및 수정</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">학생 관리</h3>
          <p className="text-gray-600">학생 목록 및 성적 관리</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">과제 관리</h3>
          <p className="text-gray-600">과제 생성 및 채점</p>
        </div>
      </div>
    </div>
  );
}


