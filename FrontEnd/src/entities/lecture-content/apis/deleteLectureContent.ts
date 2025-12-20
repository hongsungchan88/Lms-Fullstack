import { api } from '@/shared';

export const deleteLectureContent = async (contentId: number): Promise<void> => {
  return api.delete(`lecture-contents/${contentId}`).json();
};


