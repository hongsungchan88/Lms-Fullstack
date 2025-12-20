package com.lms.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "comment")
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id", nullable = false)
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private BoardPost post;

    @Column(nullable = false, length = 2000)
    private String content; // 댓글 내용

    @Column(nullable = false, length = 50)
    private String author; // 작성자 (학생명 또는 교사명)

    @Column(name = "author_role", length = 20)
    private String authorRole; // 작성자 역할 (STUDENT, TEACHER, ADMIN)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment; // 대댓글인 경우 부모 댓글

    @Builder
    public Comment(BoardPost post, String content, String author, String authorRole, Comment parentComment) {
        this.post = post;
        this.content = content;
        this.author = author;
        this.authorRole = authorRole;
        this.parentComment = parentComment;
    }

    public void update(String content) {
        this.content = content;
    }
}


