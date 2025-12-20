package com.lms.dto;

import com.lms.domain.Assignment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssignmentDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "과제 제목은 필수 입력 값입니다.")
        private String title;

        private String description;

        @NotNull(message = "마감일은 필수 입력 값입니다.")
        private LocalDate dueDate;

        @NotNull(message = "강의 ID는 필수 입력 값입니다.")
        private Long lectureId;

        private String filePath;
        private String originalFileName;

        @NotNull(message = "만점은 필수 입력 값입니다.")
        private Integer maxScore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "과제 제목은 필수 입력 값입니다.")
        private String title;

        private String description;

        @NotNull(message = "마감일은 필수 입력 값입니다.")
        private LocalDate dueDate;

        private String filePath;
        private String originalFileName;

        @NotNull(message = "만점은 필수 입력 값입니다.")
        private Integer maxScore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentResponse {
        private Long assignmentId;
        private String title;
        private String description;
        private LocalDate dueDate;
        private Long lectureId;
        private String lectureTitle;
        private String filePath;
        private String originalFileName;
        private Integer maxScore;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static AssignmentResponse from(Assignment assignment) {
            return AssignmentResponse.builder()
                    .assignmentId(assignment.getAssignmentId())
                    .title(assignment.getTitle())
                    .description(assignment.getDescription())
                    .dueDate(assignment.getDueDate())
                    .lectureId(assignment.getLecture().getLectureId())
                    .lectureTitle(assignment.getLecture().getTitle())
                    .filePath(assignment.getFilePath())
                    .originalFileName(assignment.getOriginalFileName())
                    .maxScore(assignment.getMaxScore())
                    .createdAt(assignment.getCreatedAt())
                    .updatedAt(assignment.getUpdatedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmissionRequest {
        private String content;
        private String filePath;
        private String originalFileName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeRequest {
        @NotNull(message = "점수는 필수 입력 값입니다.")
        private Integer score;

        private String feedback;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmissionResponse {
        private Long submissionId;
        private Long assignmentId;
        private String assignmentTitle;
        private String studentNumber;
        private String studentName;
        private String content;
        private String filePath;
        private String originalFileName;
        private LocalDateTime submittedAt;
        private Integer score;
        private String feedback;
        private LocalDateTime gradedAt;
        private Long gradedByInstructorNumber;
        private String gradedByInstructorName;

        public static SubmissionResponse from(com.lms.domain.AssignmentSubmission submission) {
            return SubmissionResponse.builder()
                    .submissionId(submission.getSubmissionId())
                    .assignmentId(submission.getAssignment().getAssignmentId())
                    .assignmentTitle(submission.getAssignment().getTitle())
                    .studentNumber(submission.getStudent().getStudentNumber())
                    .studentName(submission.getStudent().getName())
                    .content(submission.getContent())
                    .filePath(submission.getFilePath())
                    .originalFileName(submission.getOriginalFileName())
                    .submittedAt(submission.getSubmittedAt())
                    .score(submission.getScore())
                    .feedback(submission.getFeedback())
                    .gradedAt(submission.getGradedAt())
                    .gradedByInstructorNumber(submission.getGradedBy() != null ? submission.getGradedBy().getInstructorNumber() : null)
                    .gradedByInstructorName(submission.getGradedBy() != null ? submission.getGradedBy().getName() : null)
                    .build();
        }
    }
}
