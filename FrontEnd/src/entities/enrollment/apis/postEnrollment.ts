import { api } from '@/shared';
import type { StudentLectureDto } from '@/shared/types';

export const postEnrollment = async (studentNumber: string, lectureIds: number[]) => {
  const response = await api
    .post('enrollment/submit', { 
      json: { 
        studentNumber,
        lectureIds 
      } 
    })
    .json<StudentLectureDto.StudentLectureResponse[]>();
  return response;
};
