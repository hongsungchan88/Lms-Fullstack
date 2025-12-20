package com.lms.dto;

import com.lms.domain.LectureContent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class LectureContentDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "강의 ID는 필수 입력 값입니다.")
        private Long lectureId;

        @NotNull(message = "회차 번호는 필수 입력 값입니다.")
        private Integer sessionNumber;

        @NotBlank(message = "회차 제목은 필수 입력 값입니다.")
        private String title;

        private String description;
        private String videoUrl;
        private Integer videoDuration;
        private String materialUrl;
        private String materialFileName;
        private String notes;
        private String learningObjectives;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "회차 제목은 필수 입력 값입니다.")
        private String title;

        private String description;
        private String videoUrl;
        private Integer videoDuration;
        private String materialUrl;
        private String materialFileName;
        private String notes;
        private String learningObjectives;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LectureContentResponse {
        private Long contentId;
        private Long lectureId;
        private Integer sessionNumber;
        private String title;
        private String description;
        private String videoUrl;
        private Integer videoDuration;
        private String materialUrl;
        private String materialFileName;
        private String notes;
        private String learningObjectives;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static LectureContentResponse from(LectureContent content) {
            return LectureContentResponse.builder()
                    .contentId(content.getContentId())
                    .lectureId(content.getLecture().getLectureId())
                    .sessionNumber(content.getSessionNumber())
                    .title(content.getTitle())
                    .description(content.getDescription())
                    .videoUrl(content.getVideoUrl())
                    .videoDuration(content.getVideoDuration())
                    .materialUrl(content.getMaterialUrl())
                    .materialFileName(content.getMaterialFileName())
                    .notes(content.getNotes())
                    .learningObjectives(content.getLearningObjectives())
                    .createdAt(content.getCreatedAt())
                    .updatedAt(content.getUpdatedAt())
                    .build();
        }
    }
}


