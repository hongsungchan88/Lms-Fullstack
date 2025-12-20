package com.lms.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "lecture")
public class Lecture extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lecture_id", nullable = false)
    private Long lectureId;

    @Column(name = "title", nullable = false, length = 30)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_number", nullable = false)
    private Instructor instructor;

    @Column(name = "total_lecture")
    private Integer totalLecture;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    @Builder
    public Lecture(String title, Instructor instructor, Integer totalLecture, String category, String thumbnailUrl) {
        this.title = title;
        this.instructor = instructor;
        this.totalLecture = totalLecture;
        this.category = category;
        this.thumbnailUrl = thumbnailUrl;
    }

    // 강의 정보 업데이트 메서드
    public void update(String title, Integer totalLecture, String category, String thumbnailUrl) {
        this.title = title;
        this.totalLecture = totalLecture;
        this.category = category;
        this.thumbnailUrl = thumbnailUrl;
    }
}