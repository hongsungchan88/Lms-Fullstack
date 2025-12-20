package com.lms.dto;

import com.lms.domain.StudentLecture;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class StudentLectureDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnrollRequest {
        @NotBlank(message = "학번은 필수 입력 값입니다.")
        private String studentNumber;

        @NotNull(message = "강의 ID는 필수 입력 값입니다.")
        private Long lectureId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentLectureResponse {
        private Long studentLectureId;
        private String studentNumber;
        private Long lectureId;
        private LocalDateTime createdAt;

        private String title;
        private String instructorName;
        private String category;
        private Integer progress;
        private Integer currentLecture;
        private Integer totalLecture;
        private String nextLectureTitle;
        private String thumbnailUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnrollmentSubmitRequest {
        @NotBlank(message = "학번은 필수 입력 값입니다.")
        private String studentNumber;

        @NotNull(message = "강의 ID 리스트는 필수입니다.")
        private java.util.List<Long> lectureIds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProgressRequest {
        @NotBlank(message = "학번은 필수 입력 값입니다.")
        private String studentNumber;

        @NotNull(message = "강의 ID는 필수 입력 값입니다.")
        private Long lectureId;

        @NotNull(message = "진행도는 필수 입력 값입니다.")
        private Integer progress;

        @NotNull(message = "현재 강의 수는 필수 입력 값입니다.")
        private Integer currentLecture;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KpiResponse {
        private int totalCourses;
        private int completedCourses;
        private int inProgressCourses;
    }
}