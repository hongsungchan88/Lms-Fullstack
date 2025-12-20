package com.lms.dto;

import com.lms.domain.Instructor;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class InstructorDto {

    // 교사 등록 요청 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "교사번호는 필수 입력 값입니다.")
        private Long instructorNumber;

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        @Size(min = 8, max = 20, message = "비밀번호는 8~20자여야 합니다.")
        private String password;

        @NotBlank(message = "이름은 필수 입력 값입니다.")
        @Size(max = 30, message = "이름은 최대 30자까지 가능합니다.")
        private String name;

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        @Email(message = "유효한 이메일 형식이 아닙니다.")
        @Size(max = 30, message = "이메일은 최대 30자까지 가능합니다.")
        private String email;

        @Pattern(regexp = "^(01[016789])-?([0-9]{3,4})-?([0-9]{4})$", message = "유효한 전화번호 형식이 아닙니다.")
        private String phone;
    }

    // 회원 가입 요청 DTO (프론트 용어에 맞춰 별도 타입 제공)
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotNull(message = "교사번호는 필수 입력 값입니다.")
        private Long instructorNumber;

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        @Size(min = 8, max = 20, message = "비밀번호는 8~20자여야 합니다.")
        private String password;

        @NotBlank(message = "이름은 필수 입력 값입니다.")
        @Size(max = 30, message = "이름은 최대 30자까지 가능합니다.")
        private String name;

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        @Email(message = "유효한 이메일 형식이 아닙니다.")
        @Size(max = 30, message = "이메일은 최대 30자까지 가능합니다.")
        private String email;

        @Pattern(regexp = "^(01[016789])-?([0-9]{3,4})-?([0-9]{4})$", message = "유효한 전화번호 형식이 아닙니다.")
        private String phone;
    }

    // 교사 정보 업데이트 요청 DTO (부분 업데이트)
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "이름은 필수 입력 값입니다.")
        @Size(max = 30, message = "이름은 최대 30자까지 가능합니다.")
        private String name;

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        @Email(message = "유효한 이메일 형식이 아닙니다.")
        @Size(max = 30, message = "이메일은 최대 30자까지 가능합니다.")
        private String email;

        @Pattern(regexp = "^(01[016789])-?([0-9]{3,4})-?([0-9]{4})$", message = "유효한 전화번호 형식이 아닙니다.")
        private String phone;
    }

    // 교사 비밀번호 변경 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdatePasswordRequest {
        @NotBlank(message = "현재 비밀번호는 필수 입력 값입니다.")
        private String currentPassword;

        @NotBlank(message = "새 비밀번호는 필수 입력 값입니다.")
        @Size(min = 8, max = 20, message = "새 비밀번호는 8~20자여야 합니다.")
        private String newPassword;
    }

    // 로그인 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotNull(message = "교사번호는 필수 입력 값입니다.")
        private Long instructorNumber;

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        private String password;
    }

    // 아이디 중복 확인 요청 DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckIdRequest {
        @NotNull(message = "교사번호는 필수 입력 값입니다.")
        private Long instructorNumber;
    }

    // 아이디 중복 확인 응답 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckIdResponse {
        private boolean available;
    }

    // 교사 응답 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InstructorResponse {
        private Long instructorNumber;
        private String name;
        private String email;
        private String phone;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        // Entity -> DTO 변환 메서드
        public static InstructorResponse from(Instructor instructor) {
            return InstructorResponse.builder()
                    .instructorNumber(instructor.getInstructorNumber())
                    .name(instructor.getName())
                    .email(instructor.getEmail())
                    .phone(instructor.getPhone())
                    .createdAt(instructor.getCreatedAt())
                    .updatedAt(instructor.getUpdatedAt())
                    .build();
        }
    }

    // 로그인 응답 DTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private InstructorResponse user;
        private String message;
        private String role; // STUDENT 또는 TEACHER
    }
}

