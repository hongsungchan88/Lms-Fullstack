package com.lms.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "assignment_submission")
public class AssignmentSubmission extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id", nullable = false)
    private Long submissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(length = 2000)
    private String content; // 제출 내용

    @Column(name = "file_path", length = 500)
    private String filePath; // 제출 파일 경로

    @Column(name = "original_file_name", length = 255)
    private String originalFileName; // 원본 파일명

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt; // 제출 시간

    @Column(name = "score")
    private Integer score; // 점수

    @Column(name = "feedback", length = 2000)
    private String feedback; // 피드백

    @Column(name = "graded_at")
    private LocalDateTime gradedAt; // 채점 시간

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    private Instructor gradedBy; // 채점한 교사

    @Builder
    public AssignmentSubmission(Assignment assignment, Student student, String content,
                               String filePath, String originalFileName, LocalDateTime submittedAt) {
        this.assignment = assignment;
        this.student = student;
        this.content = content;
        this.filePath = filePath;
        this.originalFileName = originalFileName;
        this.submittedAt = submittedAt != null ? submittedAt : LocalDateTime.now();
    }

    public void grade(Integer score, String feedback, Instructor gradedBy) {
        this.score = score;
        this.feedback = feedback;
        this.gradedBy = gradedBy;
        this.gradedAt = LocalDateTime.now();
    }

    public void updateSubmission(String content, String filePath, String originalFileName) {
        this.content = content;
        this.filePath = filePath;
        this.originalFileName = originalFileName;
        this.submittedAt = LocalDateTime.now();
    }
}


