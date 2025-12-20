import { useQuery } from '@tanstack/react-query';
import { UnEnrolledList, EnrolledList } from '@/features/enrollment/ui';
import { useSelectedEnrollment } from '@/features/enrollment/hooks';
import { useEnrollment, useSubmitEnrollment } from '@/features/enrollment/model/useEnrollment';
import clsx from 'clsx';
import { useSyllabusViewer } from '@/features/enrollment/model/useSyllabusViewer';
import SyllabusViewer from '@/features/enrollment/ui/SyllabusViewer';
import Modal from '@/shared/ui/Modal';
import { LoadingSpinner } from '@/shared';
import type { LectureResponse } from '@/entities/lecture/types/backend';

// 백엔드 응답을 프론트엔드 형식으로 변환
const convertToEnrollment = (lecture: LectureResponse) => ({
  id: lecture.lectureId,
  imageUrl: lecture.thumbnailUrl || '/default-thumbnail.png',
  title: lecture.title,
  professor: lecture.instructorName,
  syllabus: {
    fileUrl: '',
    fileType: 'pdf' as const,
  },
});

export default function Enrollment() {
  const { data: lectures, isLoading } = useEnrollment();
  const submitMutation = useSubmitEnrollment();
  const { selectedIds, addEnrollment, removeEnrollment, clearAll } = useSelectedEnrollment();
  const { syllabus, open, close } = useSyllabusViewer();

  // 이미 수강 중인 강의 ID 목록 (실제로는 API에서 가져와야 함)
  const enrolledLectureIds: number[] = [];

  const unEnrolledLectures = (lectures || [])
    .filter(lec => !enrolledLectureIds.includes(lec.lectureId) && !selectedIds.includes(lec.lectureId))
    .map(convertToEnrollment);

  const enrolledLectures = (lectures || [])
    .filter(lec => selectedIds.includes(lec.lectureId))
    .map(convertToEnrollment);

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      alert('강의를 선택하세요!');
      return;
    }

    try {
      await submitMutation.mutateAsync(selectedIds);
      alert('수강 신청이 완료되었습니다!');
      clearAll();
    } catch (error) {
      alert('수강 신청 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={clsx('overflow-x-auto', 'bg-gray-50', 'min-h-screen')}>
      <div
        className={clsx(
          'flex',
          'flex-nowrap',
          'gap-6',
          'px-6',
          'py-8',
          'min-w-[1280px]',
          'items-start'
        )}
      >
        <UnEnrolledList
          lectures={unEnrolledLectures}
          onAddLecture={addEnrollment}
          onPlanClick={open}
        />
        <EnrolledList
          lectures={enrolledLectures}
          onDeleteLecture={removeEnrollment}
          onRemoveAll={clearAll}
          onSubmit={handleSubmit}
          isSubmitting={submitMutation.isPending}
        />
      </div>

      {syllabus && (
        <Modal onClose={close}>
          <SyllabusViewer syllabus={syllabus} />
        </Modal>
      )}
    </div>
  );
}
