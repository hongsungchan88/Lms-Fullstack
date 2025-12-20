import { api } from '@/shared';
import type { InstructorResponse } from './getAllInstructors';

export interface CreateInstructorRequest {
  instructorNumber: number;
  password: string;
  name: string;
  email: string;
  phone?: string;
}

export const createInstructor = async (request: CreateInstructorRequest): Promise<InstructorResponse> => {
  try {
    return await api.post('instructor/register', { json: request }).json<InstructorResponse>();
  } catch (error: any) {
    // ky HTTPError 처리
    if (error.response) {
      try {
        // 먼저 텍스트로 읽어서 JSON인지 확인
        const errorText = await error.response.text();
        let errorBody: any;
        
        try {
          errorBody = JSON.parse(errorText);
        } catch {
          // JSON이 아니면 텍스트 그대로 사용 (IllegalArgumentException의 경우)
          throw new Error(errorText || '교사 생성에 실패했습니다.');
        }
        
        // 백엔드가 Map<String, String> 형태로 반환하는 경우 (검증 에러)
        if (typeof errorBody === 'object' && !errorBody.message && !Array.isArray(errorBody)) {
          const errorMessages = Object.entries(errorBody)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          throw new Error(errorMessages || '교사 생성에 실패했습니다.');
        }
        
        // message 필드가 있는 경우
        if (errorBody.message) {
          throw new Error(errorBody.message);
        }
        
        // 그 외의 경우
        throw new Error(errorText || '교사 생성에 실패했습니다.');
      } catch (parseError: any) {
        // 이미 Error 객체면 그대로 throw, 아니면 새로 생성
        if (parseError instanceof Error) {
          throw parseError;
        }
        throw new Error(parseError?.message || '교사 생성에 실패했습니다.');
      }
    }
    throw error;
  }
};


