package com.lms.dto;

import com.lms.domain.Lecture;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class LectureDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "강의 제목은 필수 입력 값입니다.")
        private String title;

        @NotNull(message = "강사 ID는 필수 입력 값입니다.")
        private Long instructorNumber;

        private Integer totalLecture;
        private String category;
        private String thumbnailUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "강의 제목은 필수 입력 값입니다.")
        private String title;

        private Integer totalLecture;
        private String category;
        private String thumbnailUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LectureResponse {
        private Long lectureId;
        private String title;
        private Long instructorNumber;
        private String instructorName;
        private Integer totalLecture;
        private String category;
        private String thumbnailUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static LectureResponse from(Lecture lecture) {
            return LectureResponse.builder()
                    .lectureId(lecture.getLectureId())
                    .title(lecture.getTitle())
                    .instructorNumber(lecture.getInstructor().getInstructorNumber())
                    .instructorName(lecture.getInstructor().getName())
                    .totalLecture(lecture.getTotalLecture())
                    .category(lecture.getCategory())
                    .thumbnailUrl(lecture.getThumbnailUrl())
                    .createdAt(lecture.getCreatedAt())
                    .updatedAt(lecture.getUpdatedAt())
                    .build();
        }
    }
}