package com.lms.dto;

import com.lms.domain.Admin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class AdminDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "관리자 ID는 필수 입력 값입니다.")
        private String adminId;

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        private String password;

        @NotBlank(message = "이름은 필수 입력 값입니다.")
        private String name;

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        private String email;

        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "관리자 ID는 필수 입력 값입니다.")
        private String adminId;

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        private String password;

        @NotBlank(message = "이름은 필수 입력 값입니다.")
        private String name;

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        private String email;

        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "관리자 ID는 필수 입력 값입니다.")
        private String adminId;

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "이름은 필수 입력 값입니다.")
        private String name;

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        private String email;

        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdatePasswordRequest {
        @NotBlank(message = "현재 비밀번호는 필수 입력 값입니다.")
        private String currentPassword;

        @NotBlank(message = "새 비밀번호는 필수 입력 값입니다.")
        private String newPassword;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminResponse {
        private String adminId;
        private String name;
        private String email;
        private String phone;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static AdminResponse from(Admin admin) {
            return AdminResponse.builder()
                    .adminId(admin.getAdminId())
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .phone(admin.getPhone())
                    .createdAt(admin.getCreatedAt())
                    .updatedAt(admin.getUpdatedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private AdminResponse user;
        private String message;
        private String role; // ADMIN
    }
}


