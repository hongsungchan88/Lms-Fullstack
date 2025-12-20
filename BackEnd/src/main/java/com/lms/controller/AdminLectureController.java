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
@RequestMapping("/api/admin/lectures")
@RequiredArgsConstructor
public class AdminLectureController {

    private final LectureService lectureService;

    // 관리자가 강의 생성 (교사 할당 포함)
    @PostMapping
    public ResponseEntity<LectureDto.LectureResponse> createLecture(@Valid @RequestBody LectureDto.CreateRequest request) {
        LectureDto.LectureResponse response = lectureService.createLecture(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 모든 강의 조회
    @GetMapping
    public ResponseEntity<List<LectureDto.LectureResponse>> getAllLectures() {
        return ResponseEntity.ok(lectureService.getAllLectures());
    }

    // 강의 수정 (관리자는 모든 강의 수정 가능)
    @PutMapping("/{lectureId}")
    public ResponseEntity<LectureDto.LectureResponse> updateLecture(
            @PathVariable Long lectureId,
            @Valid @RequestBody LectureDto.UpdateRequest request) {
        LectureDto.LectureResponse response = lectureService.updateLectureByAdmin(lectureId, request);
        return ResponseEntity.ok(response);
    }

    // 강의 삭제 (관리자는 모든 강의 삭제 가능)
    @DeleteMapping("/{lectureId}")
    public ResponseEntity<Void> deleteLecture(@PathVariable Long lectureId) {
        lectureService.deleteLectureByAdmin(lectureId);
        return ResponseEntity.noContent().build();
    }
}

