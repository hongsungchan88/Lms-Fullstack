package com.lms.dto;

import com.lms.domain.Department;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class DepartmentDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "학과명은 필수 입력 값입니다.")
        @Size(max = 50, message = "학과명은 최대 50자까지 가능합니다.")
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentResponse {
        private Long departmentsId;
        private String name;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static DepartmentResponse from(Department department) {
            return DepartmentResponse.builder()
                    .departmentsId(department.getDepartmentsId())
                    .name(department.getName())
                    .createdAt(department.getCreatedAt())
                    .updatedAt(department.getUpdatedAt())
                    .build();
        }
    }
}