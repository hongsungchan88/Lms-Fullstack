package com.lms.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "assignment")
public class Assignment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id", nullable = false)
    private Long assignmentId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "original_file_name")
    private String originalFileName;

    @Column(name = "max_score")
    private Integer maxScore; // 만점

    @Builder
    public Assignment(String title, String description, LocalDate dueDate, Lecture lecture,
                      String filePath, String originalFileName, Integer maxScore) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.lecture = lecture;
        this.filePath = filePath;
        this.originalFileName = originalFileName;
        this.maxScore = maxScore;
    }

    public void update(String title, String description, LocalDate dueDate, String filePath,
                      String originalFileName, Integer maxScore) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.filePath = filePath;
        this.originalFileName = originalFileName;
        this.maxScore = maxScore;
    }
}



