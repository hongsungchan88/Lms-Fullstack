package com.lms.dto;

import com.lms.domain.BoardPost;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class BoardPostDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "제목은 필수 입력 값입니다.")
        private String title;

        @NotBlank(message = "내용은 필수 입력 값입니다.")
        private String content;

        @NotBlank(message = "작성자는 필수 입력 값입니다.")
        private String author;

        private String attachmentUrl;
        private Long lectureId;
        private String category; // NOTICE, QNA, GENERAL
        private String authorRole; // STUDENT, TEACHER, ADMIN
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "제목은 필수 입력 값입니다.")
        private String title;

        @NotBlank(message = "내용은 필수 입력 값입니다.")
        private String content;

        private String attachmentUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BoardPostResponse {
        private Long postId;
        private String title;
        private String content;
        private String author;
        private String attachmentUrl;
        private Long lectureId;
        private String lectureTitle;
        private String category;
        private String authorRole;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static BoardPostResponse from(BoardPost post) {
            return BoardPostResponse.builder()
                    .postId(post.getPostId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .author(post.getAuthor())
                    .attachmentUrl(post.getAttachmentUrl())
                    .lectureId(post.getLecture() != null ? post.getLecture().getLectureId() : null)
                    .lectureTitle(post.getLecture() != null ? post.getLecture().getTitle() : null)
                    .category(post.getCategory())
                    .authorRole(post.getAuthorRole())
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentRequest {
        @NotBlank(message = "댓글 내용은 필수 입력 값입니다.")
        private String content;

        @NotBlank(message = "작성자는 필수 입력 값입니다.")
        private String author;

        private String authorRole;
        private Long parentCommentId; // 대댓글인 경우
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentResponse {
        private Long commentId;
        private Long postId;
        private String content;
        private String author;
        private String authorRole;
        private Long parentCommentId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static CommentResponse from(com.lms.domain.Comment comment) {
            return CommentResponse.builder()
                    .commentId(comment.getCommentId())
                    .postId(comment.getPost().getPostId())
                    .content(comment.getContent())
                    .author(comment.getAuthor())
                    .authorRole(comment.getAuthorRole())
                    .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getCommentId() : null)
                    .createdAt(comment.getCreatedAt())
                    .updatedAt(comment.getUpdatedAt())
                    .build();
        }
    }
}
