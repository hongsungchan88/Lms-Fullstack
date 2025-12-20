import { useParams } from 'react-router-dom';
import { useLectureContents } from '@/features/lecture-content/model';
import { LoadingSpinner } from '@/shared';
import { Header } from '@/widgets';
import { PlayIcon, DocumentIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function LectureContents() {
  const { id: lectureId } = useParams<{ id: string }>();
  const lectureIdNum = lectureId ? parseInt(lectureId) : 0;

  const { data: contents, isLoading, isError, error } = useLectureContents(lectureIdNum);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div className="text-red-500 p-6">강의 회차를 불러오는 데 실패했습니다: {error?.message}</div>;
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">강의 회차</h2>
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          등록된 강의 회차가 없습니다.
        </div>
      </div>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${secs}초`;
    }
    return `${minutes}분 ${secs}초`;
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {contents[0]?.lectureTitle || '강의'} 회차 목록
        </h2>

      <div className="space-y-4">
        {contents.map((content) => (
          <div
            key={content.contentId}
            className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {content.episodeNumber}회차
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{content.title}</h3>
                </div>
                {content.description && (
                  <p className="text-gray-600 mb-3">{content.description}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {content.videoUrl && (
                <div className="flex items-center gap-2">
                  <PlayIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">영상:</span>
                  <a
                    href={content.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    영상 보기
                  </a>
                  {content.playTimeSeconds && (
                    <span className="text-gray-500">({formatDuration(content.playTimeSeconds)})</span>
                  )}
                </div>
              )}
              {content.materialUrl && (
                <div className="flex items-center gap-2">
                  <DocumentIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">자료:</span>
                  <a
                    href={content.materialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    자료 다운로드
                  </a>
                </div>
              )}
              {content.learningObjective && (
                <div className="md:col-span-2">
                  <div className="flex items-start gap-2">
                    <AcademicCapIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">학습 목표:</span>
                      <p className="text-gray-600 mt-1">{content.learningObjective}</p>
                    </div>
                  </div>
                </div>
              )}
              {content.noteContent && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">강의 노트:</span>
                  <p className="text-gray-600 mt-1 whitespace-pre-wrap">{content.noteContent}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}


