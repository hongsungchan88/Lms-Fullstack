package com.lms.controller;

import com.lms.dto.BoardPostDto;
import com.lms.service.BoardPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/posts")
@RequiredArgsConstructor
public class BoardPostController {

    private final BoardPostService boardPostService;

    @GetMapping
    public ResponseEntity<List<BoardPostDto.BoardPostResponse>> getPosts() {
        return ResponseEntity.ok(boardPostService.getPosts());
    }

    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<BoardPostDto.BoardPostResponse>> getPostsByLecture(@PathVariable Long lectureId) {
        return ResponseEntity.ok(boardPostService.getPostsByLecture(lectureId));
    }

    @GetMapping("/lecture/{lectureId}/category/{category}")
    public ResponseEntity<List<BoardPostDto.BoardPostResponse>> getPostsByLectureAndCategory(
            @PathVariable Long lectureId,
            @PathVariable String category) {
        return ResponseEntity.ok(boardPostService.getPostsByLectureAndCategory(lectureId, category));
    }

    @PostMapping
    public ResponseEntity<BoardPostDto.BoardPostResponse> createPost(@Valid @RequestBody BoardPostDto.CreateRequest request) {
        BoardPostDto.BoardPostResponse response = boardPostService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardPostDto.BoardPostResponse> updatePost(@PathVariable Long id,
                                                                     @Valid @RequestBody BoardPostDto.UpdateRequest request) {
        return ResponseEntity.ok(boardPostService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        boardPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // 댓글 작성
    @PostMapping("/{postId}/comments")
    public ResponseEntity<BoardPostDto.CommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody BoardPostDto.CommentRequest request) {
        BoardPostDto.CommentResponse response = boardPostService.createComment(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 댓글 목록 조회
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<BoardPostDto.CommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(boardPostService.getComments(postId));
    }

    // 댓글 수정
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<BoardPostDto.CommentResponse> updateComment(
            @PathVariable Long commentId,
            @RequestBody String content) {
        return ResponseEntity.ok(boardPostService.updateComment(commentId, content));
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        boardPostService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}



