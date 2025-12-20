package com.lms.controller;

import com.lms.dto.LectureContentDto;
import com.lms.service.LectureContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecture-contents")
@RequiredArgsConstructor
public class LectureContentController {

    private final LectureContentService lectureContentService;

    @PostMapping
    public ResponseEntity<LectureContentDto.LectureContentResponse> createContent(
            @Valid @RequestBody LectureContentDto.CreateRequest request) {
        LectureContentDto.LectureContentResponse response = lectureContentService.createContent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<LectureContentDto.LectureContentResponse>> getContentsByLecture(
            @PathVariable Long lectureId) {
        return ResponseEntity.ok(lectureContentService.getContentsByLecture(lectureId));
    }

    @GetMapping("/{contentId}")
    public ResponseEntity<LectureContentDto.LectureContentResponse> getContent(@PathVariable Long contentId) {
        return ResponseEntity.ok(lectureContentService.getContent(contentId));
    }

    @PutMapping("/{contentId}")
    public ResponseEntity<LectureContentDto.LectureContentResponse> updateContent(
            @PathVariable Long contentId,
            @Valid @RequestBody LectureContentDto.UpdateRequest request) {
        return ResponseEntity.ok(lectureContentService.updateContent(contentId, request));
    }

    @DeleteMapping("/{contentId}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long contentId) {
        lectureContentService.deleteContent(contentId);
        return ResponseEntity.noContent().build();
    }
}


