package com.lms.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "lecture_content")
public class LectureContent extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id", nullable = false)
    private Long contentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    @Column(name = "session_number", nullable = false)
    private Integer sessionNumber; // 회차 번호

    @Column(nullable = false, length = 100)
    private String title; // 회차 제목

    @Column(length = 2000)
    private String description; // 회차 설명

    @Column(name = "video_url", length = 500)
    private String videoUrl; // 영상 URL

    @Column(name = "video_duration")
    private Integer videoDuration; // 재생 시간 (초)

    @Column(name = "material_url", length = 500)
    private String materialUrl; // 강의 자료 URL (PDF, PPT 등)

    @Column(name = "material_file_name", length = 255)
    private String materialFileName; // 자료 파일명

    @Column(name = "notes", length = 5000)
    private String notes; // 강의 노트/요약

    @Column(name = "learning_objectives", length = 1000)
    private String learningObjectives; // 학습 목표

    @Builder
    public LectureContent(Lecture lecture, Integer sessionNumber, String title, String description,
                          String videoUrl, Integer videoDuration, String materialUrl, String materialFileName,
                          String notes, String learningObjectives) {
        this.lecture = lecture;
        this.sessionNumber = sessionNumber;
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.videoDuration = videoDuration;
        this.materialUrl = materialUrl;
        this.materialFileName = materialFileName;
        this.notes = notes;
        this.learningObjectives = learningObjectives;
    }

    public void update(String title, String description, String videoUrl, Integer videoDuration,
                      String materialUrl, String materialFileName, String notes, String learningObjectives) {
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.videoDuration = videoDuration;
        this.materialUrl = materialUrl;
        this.materialFileName = materialFileName;
        this.notes = notes;
        this.learningObjectives = learningObjectives;
    }
}


