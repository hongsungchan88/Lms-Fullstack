package com.lms.controller;

import com.lms.dto.StudentDto;
import com.lms.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students") // 기본 URL 경로
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // 학생 등록 (POST)
    @PostMapping
    public ResponseEntity<StudentDto.StudentResponse> createStudent(@Valid @RequestBody StudentDto.CreateRequest request) {
        StudentDto.StudentResponse response = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 모든 학생 조회 (GET)
    @GetMapping
    public ResponseEntity<List<StudentDto.StudentResponse>> getAllStudents() {
        List<StudentDto.StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // 학번으로 학생 조회 (GET)
    @GetMapping("/{studentNumber}")
    public ResponseEntity<StudentDto.StudentResponse> getStudentByStudentNumber(@PathVariable String studentNumber) {
        StudentDto.StudentResponse student = studentService.getStudentByStudentNumber(studentNumber);
        return ResponseEntity.ok(student);
    }

    // 학생 정보 업데이트 (PUT)
    @PutMapping("/{studentNumber}")
    public ResponseEntity<StudentDto.StudentResponse> updateStudent(
            @PathVariable String studentNumber,
            @Valid @RequestBody StudentDto.UpdateRequest request) {
        StudentDto.StudentResponse updatedStudent = studentService.updateStudent(studentNumber, request);
        return ResponseEntity.ok(updatedStudent);
    }

    // 학생 비밀번호 변경 (PATCH) - 부분 업데이트 개념
    @PatchMapping("/{studentNumber}/password")
    public ResponseEntity<Void> updateStudentPassword(
            @PathVariable String studentNumber,
            @Valid @RequestBody StudentDto.UpdatePasswordRequest request) {
        studentService.updateStudentPassword(studentNumber, request);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // 학생 삭제 (DELETE)
    @DeleteMapping("/{studentNumber}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String studentNumber) {
        studentService.deleteStudent(studentNumber);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}