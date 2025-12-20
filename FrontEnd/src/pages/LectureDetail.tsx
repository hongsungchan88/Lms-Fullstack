import { useParams } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { lectureQueries } from '@/entities/lecture';
import { Link } from 'react-router-dom';
import { Header } from '@/widgets';
import { 
  BookOpenIcon, 
  ClipboardDocumentListIcon, 
  ChatBubbleLeftRightIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';

export default function LectureDetail() {
  const { id } = useParams<{ id: string }>();
  const lectureId = id ? parseInt(id) : 0;
  
  const { data: lecture } = useSuspenseQuery(lectureQueries.lectureDetail(lectureId));

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{lecture.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5" />
            <span>교사: {lecture.instructorName}</span>
          </div>
          {lecture.category && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {lecture.category}
            </span>
          )}
          {lecture.totalLecture && (
            <span className="text-sm">총 {lecture.totalLecture}회차</span>
          )}
        </div>
        {lecture.thumbnailUrl && (
          <img 
            src={lecture.thumbnailUrl} 
            alt={lecture.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to={`/lecture/${lectureId}/contents`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <BookOpenIcon className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">강의 회차</h3>
          <p className="text-gray-600 text-sm">강의 영상과 자료를 확인하세요</p>
        </Link>

        <Link
          to={`/lecture/${lectureId}/assignments`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <ClipboardDocumentListIcon className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">과제</h3>
          <p className="text-gray-600 text-sm">과제를 확인하고 제출하세요</p>
        </Link>

        <Link
          to={`/lecture/${lectureId}/board`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">게시판</h3>
          <p className="text-gray-600 text-sm">질문과 토론을 나누세요</p>
        </Link>
      </div>
    </div>
    </>
  );
}
