package com.lms.controller;

import com.lms.dto.LectureDto;
import com.lms.dto.StudentLectureDto;
import com.lms.service.LectureService;
import com.lms.service.StudentLectureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enrollment")
@RequiredArgsConstructor
public class EnrollmentController {

    private final LectureService lectureService;
    private final StudentLectureService studentLectureService;

    @GetMapping
    public ResponseEntity<List<LectureDto.LectureResponse>> getAvailableLectures() {
        return ResponseEntity.ok(lectureService.getAllLectures());
    }

    @PostMapping("/submit")
    public ResponseEntity<List<StudentLectureDto.StudentLectureResponse>> submitEnrollment(
            @Valid @RequestBody StudentLectureDto.EnrollmentSubmitRequest request) {
        List<StudentLectureDto.StudentLectureResponse> responses =
                studentLectureService.enrollLectures(request.getStudentNumber(), request.getLectureIds());
        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }
}



