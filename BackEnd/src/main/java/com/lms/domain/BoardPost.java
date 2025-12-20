package com.lms.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "board_post")
public class BoardPost extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 4000)
    private String content;

    @Column(length = 50)
    private String author;

    @Column(name = "attachment_url", length = 255)
    private String attachmentUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecture_id")
    private Lecture lecture; // 강의별 게시판

    @Column(name = "category", length = 50)
    private String category; // 게시글 카테고리 (NOTICE, QNA, GENERAL 등)

    @Column(name = "author_role", length = 20)
    private String authorRole; // 작성자 역할 (STUDENT, TEACHER, ADMIN)

    @Builder
    public BoardPost(String title, String content, String author, String attachmentUrl,
                     Lecture lecture, String category, String authorRole) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.attachmentUrl = attachmentUrl;
        this.lecture = lecture;
        this.category = category;
        this.authorRole = authorRole;
    }

    public void update(String title, String content, String attachmentUrl) {
        this.title = title;
        this.content = content;
        this.attachmentUrl = attachmentUrl;
    }
}



