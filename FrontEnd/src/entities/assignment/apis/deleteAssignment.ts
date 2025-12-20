import { api } from '@/shared';

// 과제 삭제 (교사/관리자용)
export const deleteAssignment = async (assignmentId: string | number): Promise<void> => {
  await api.delete(`assignment/${assignmentId}`).json();
};
