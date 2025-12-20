package com.lms.controller;

import com.lms.dto.LectureDto;
import com.lms.service.LectureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lectures")
@RequiredArgsConstructor
public class LectureController {

    private final LectureService lectureService;

    // 강의 생성
    @PostMapping
    public ResponseEntity<LectureDto.LectureResponse> createLecture(@Valid @RequestBody LectureDto.CreateRequest request) {
        LectureDto.LectureResponse response = lectureService.createLecture(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 교사가 자신의 강의 목록 조회
    @GetMapping("/instructor/{instructorNumber}")
    public ResponseEntity<List<LectureDto.LectureResponse>> getLecturesByInstructor(@PathVariable Long instructorNumber) {
        List<LectureDto.LectureResponse> lectures = lectureService.getLecturesByInstructor(instructorNumber);
        return ResponseEntity.ok(lectures);
    }

    // 강의 수정
    @PutMapping("/{lectureId}")
    public ResponseEntity<LectureDto.LectureResponse> updateLecture(
            @PathVariable Long lectureId,
            @RequestParam Long instructorNumber,
            @Valid @RequestBody LectureDto.UpdateRequest request) {
        LectureDto.LectureResponse response = lectureService.updateLecture(lectureId, instructorNumber, request);
        return ResponseEntity.ok(response);
    }

    // 강의 삭제
    @DeleteMapping("/{lectureId}")
    public ResponseEntity<Void> deleteLecture(
            @PathVariable Long lectureId,
            @RequestParam Long instructorNumber) {
        lectureService.deleteLecture(lectureId, instructorNumber);
        return ResponseEntity.noContent().build();
    }
}