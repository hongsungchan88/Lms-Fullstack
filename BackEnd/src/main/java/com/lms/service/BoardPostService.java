package com.lms.service;

import com.lms.domain.BoardPost;
import com.lms.domain.Comment;
import com.lms.domain.Lecture;
import com.lms.dto.BoardPostDto;
import com.lms.repository.BoardPostRepository;
import com.lms.repository.CommentRepository;
import com.lms.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@jakarta.transaction.Transactional
public class BoardPostService {

    private final BoardPostRepository boardPostRepository;
    private final CommentRepository commentRepository;
    private final LectureRepository lectureRepository;

    public List<BoardPostDto.BoardPostResponse> getPosts() {
        return boardPostRepository.findAll().stream()
                .map(BoardPostDto.BoardPostResponse::from)
                .collect(Collectors.toList());
    }

    public List<BoardPostDto.BoardPostResponse> getPostsByLecture(Long lectureId) {
        return boardPostRepository.findByLecture_LectureIdOrderByCreatedAtDesc(lectureId).stream()
                .map(BoardPostDto.BoardPostResponse::from)
                .collect(Collectors.toList());
    }

    public List<BoardPostDto.BoardPostResponse> getPostsByLectureAndCategory(Long lectureId, String category) {
        return boardPostRepository.findByLecture_LectureIdAndCategoryOrderByCreatedAtDesc(lectureId, category).stream()
                .map(BoardPostDto.BoardPostResponse::from)
                .collect(Collectors.toList());
    }

    public BoardPostDto.BoardPostResponse createPost(BoardPostDto.CreateRequest request) {
        Lecture lecture = null;
        if (request.getLectureId() != null) {
            lecture = lectureRepository.findById(request.getLectureId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));
        }

        BoardPost post = BoardPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(request.getAuthor())
                .attachmentUrl(request.getAttachmentUrl())
                .lecture(lecture)
                .category(request.getCategory())
                .authorRole(request.getAuthorRole())
                .build();
        return BoardPostDto.BoardPostResponse.from(boardPostRepository.save(post));
    }

    public BoardPostDto.BoardPostResponse updatePost(Long postId, BoardPostDto.UpdateRequest request) {
        BoardPost post = boardPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        post.update(request.getTitle(), request.getContent(), request.getAttachmentUrl());
        return BoardPostDto.BoardPostResponse.from(boardPostRepository.save(post));
    }

    public void deletePost(Long postId) {
        if (!boardPostRepository.existsById(postId)) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
        }
        boardPostRepository.deleteById(postId);
    }

    // 댓글 작성
    public BoardPostDto.CommentResponse createComment(Long postId, BoardPostDto.CommentRequest request) {
        BoardPost post = boardPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글을 찾을 수 없습니다."));
        }

        Comment comment = Comment.builder()
                .post(post)
                .content(request.getContent())
                .author(request.getAuthor())
                .authorRole(request.getAuthorRole())
                .parentComment(parentComment)
                .build();

        Comment saved = commentRepository.save(comment);
        return BoardPostDto.CommentResponse.from(saved);
    }

    // 댓글 목록 조회
    public List<BoardPostDto.CommentResponse> getComments(Long postId) {
        return commentRepository.findByPost_PostIdOrderByCreatedAtAsc(postId).stream()
                .map(BoardPostDto.CommentResponse::from)
                .collect(Collectors.toList());
    }

    // 댓글 수정
    public BoardPostDto.CommentResponse updateComment(Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        comment.update(content);
        Comment saved = commentRepository.save(comment);
        return BoardPostDto.CommentResponse.from(saved);
    }

    // 댓글 삭제
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new IllegalArgumentException("댓글을 찾을 수 없습니다.");
        }
        commentRepository.deleteById(commentId);
    }
}

