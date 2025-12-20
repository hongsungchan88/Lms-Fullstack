package com.lms.controller;

import com.lms.dto.StudentLectureDto;
import com.lms.service.StudentLectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/my-classroom")
@RequiredArgsConstructor
public class MyClassroomController {

    private final StudentLectureService studentLectureService;

    @GetMapping("/courses")
    public ResponseEntity<List<StudentLectureDto.StudentLectureResponse>> getCourses(@RequestParam("studentNumber") String studentNumber) {
        return ResponseEntity.ok(studentLectureService.getStudentLectures(studentNumber));
    }

    @GetMapping("/kpis")
    public ResponseEntity<StudentLectureDto.KpiResponse> getKpis(@RequestParam("studentNumber") String studentNumber) {
        return ResponseEntity.ok(studentLectureService.getKpis(studentNumber));
    }
}



