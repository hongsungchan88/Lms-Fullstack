package com.lms.controller;

import com.lms.dto.AssignmentDto;
import com.lms.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/assignment")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/{assignmentId}")
    public ResponseEntity<AssignmentDto.AssignmentResponse> getAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getAssignment(assignmentId));
    }

    @PostMapping
    public ResponseEntity<AssignmentDto.AssignmentResponse> createAssignment(
            @Valid @ModelAttribute AssignmentDto.CreateRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        AssignmentDto.AssignmentResponse response = assignmentService.createAssignment(request, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<AssignmentDto.AssignmentResponse>> getAssignmentsByLecture(
            @PathVariable Long lectureId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByLecture(lectureId));
    }

    @PutMapping("/{assignmentId}")
    public ResponseEntity<AssignmentDto.AssignmentResponse> updateAssignment(
            @PathVariable Long assignmentId,
            @Valid @RequestBody AssignmentDto.UpdateRequest request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(assignmentId, request));
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }

    // 과제 제출
    @PostMapping("/{assignmentId}/submit")
    public ResponseEntity<AssignmentDto.SubmissionResponse> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam String studentNumber,
            @Valid @RequestBody AssignmentDto.SubmissionRequest request) {
        AssignmentDto.SubmissionResponse response = assignmentService.submitAssignment(assignmentId, studentNumber, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 과제 제출 목록 조회 (교사용)
    @GetMapping("/{assignmentId}/submissions")
    public ResponseEntity<List<AssignmentDto.SubmissionResponse>> getSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getSubmissions(assignmentId));
    }

    // 학생의 제출 조회
    @GetMapping("/{assignmentId}/submissions/{studentNumber}")
    public ResponseEntity<AssignmentDto.SubmissionResponse> getSubmission(
            @PathVariable Long assignmentId,
            @PathVariable String studentNumber) {
        return ResponseEntity.ok(assignmentService.getSubmission(assignmentId, studentNumber));
    }

    // 과제 채점
    @PostMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<AssignmentDto.SubmissionResponse> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestParam Long instructorNumber,
            @Valid @RequestBody AssignmentDto.GradeRequest request) {
        return ResponseEntity.ok(assignmentService.gradeSubmission(submissionId, instructorNumber, request));
    }
}



