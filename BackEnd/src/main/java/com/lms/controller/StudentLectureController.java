package com.lms.controller;

import com.lms.dto.StudentLectureDto;
import com.lms.service.StudentLectureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student-lectures")
@RequiredArgsConstructor
public class StudentLectureController {

    private final StudentLectureService studentLectureService;

    // 수강 신청
    @PostMapping("/enroll")
    public ResponseEntity<StudentLectureDto.StudentLectureResponse> enrollLecture(@Valid @RequestBody StudentLectureDto.EnrollRequest request) {
        StudentLectureDto.StudentLectureResponse response = studentLectureService.enrollLecture(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 진행도 업데이트
    @PutMapping("/progress")
    public ResponseEntity<StudentLectureDto.StudentLectureResponse> updateProgress(
            @Valid @RequestBody StudentLectureDto.UpdateProgressRequest request) {
        StudentLectureDto.StudentLectureResponse response = studentLectureService.updateProgress(
                request.getStudentNumber(),
                request.getLectureId(),
                request.getProgress(),
                request.getCurrentLecture()
        );
        return ResponseEntity.ok(response);
    }
}