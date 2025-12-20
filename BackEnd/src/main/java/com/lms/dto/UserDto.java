package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UserDto {

    // 통합 로그인 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnifiedLoginRequest {
        @NotBlank(message = "ID는 필수 입력 값입니다.")
        private String id; // 학번 또는 교사번호

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        private String password;

        @NotBlank(message = "역할은 필수 입력 값입니다.")
        private String role; // "STUDENT", "TEACHER", 또는 "ADMIN"
    }

    // 통합 로그인 응답 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnifiedLoginResponse {
        private Object user; // StudentResponse 또는 InstructorResponse
        private String message;
        private String role; // STUDENT 또는 TEACHER
    }

    // 통합 사용자 응답 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnifiedUserResponse {
        private Object user; // StudentResponse 또는 InstructorResponse
        private String role; // STUDENT 또는 TEACHER
    }
}
