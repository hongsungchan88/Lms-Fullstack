package com.lms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        return ResponseEntity.ok(Map.of(
                "message", "LMS API 서버가 정상적으로 실행 중입니다.",
                "version", "1.0.0",
                "endpoints", Map.of(
                        "user", "/api/user",
                        "students", "/api/students",
                        "instructor", "/api/instructor",
                        "h2-console", "/h2-console"
                )
        ));
    }
}


