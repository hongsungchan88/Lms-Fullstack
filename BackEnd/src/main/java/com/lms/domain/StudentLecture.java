package com.lms.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "student_lecture")
public class StudentLecture extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_lecture_id", nullable = false)
    private Long studentLectureId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    // 학생의 강의 진행 상황과 관련된 필드만 추가
    @Column(name = "progress")
    private Integer progress;

    @Column(name = "current_lecture")
    private Integer currentLecture;

    @Builder
    public StudentLecture(Student student, Lecture lecture, Integer progress, Integer currentLecture) {
        this.student = student;
        this.lecture = lecture;
        this.progress = progress;
        this.currentLecture = currentLecture;
    }

    // 진행도 업데이트 메서드
    public void updateProgress(Integer progress, Integer currentLecture) {
        this.progress = progress;
        this.currentLecture = currentLecture;
    }
}