package com.lms.controller;

import com.lms.dto.LectureDto;
import com.lms.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lecture")
@RequiredArgsConstructor
public class LectureQueryController {

    private final LectureService lectureService;

    @GetMapping("/{id}")
    public ResponseEntity<LectureDto.LectureResponse> getLecture(@PathVariable Long id) {
        return ResponseEntity.ok(lectureService.getLecture(id));
    }

    @GetMapping
    public ResponseEntity<List<LectureDto.LectureResponse>> getLectures() {
        return ResponseEntity.ok(lectureService.getAllLectures());
    }
}



