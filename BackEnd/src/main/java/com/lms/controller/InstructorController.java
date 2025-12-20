package com.lms.controller;

import com.lms.dto.InstructorDto;
import com.lms.service.InstructorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorService instructorService;

    @GetMapping
    public ResponseEntity<List<InstructorDto.InstructorResponse>> getInstructor(@RequestParam(value = "instructorNumber", required = false) Long instructorNumber) {
        return ResponseEntity.ok(instructorService.getInstructors(instructorNumber));
    }

    @PostMapping("/register")
    public ResponseEntity<InstructorDto.InstructorResponse> register(@Valid @RequestBody InstructorDto.RegisterRequest request) {
        InstructorDto.InstructorResponse response = instructorService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<InstructorDto.LoginResponse> login(@Valid @RequestBody InstructorDto.LoginRequest request) {
        InstructorDto.LoginResponse response = instructorService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-id")
    public ResponseEntity<InstructorDto.CheckIdResponse> checkId(@Valid @RequestBody InstructorDto.CheckIdRequest request) {
        return ResponseEntity.ok(instructorService.checkId(request));
    }
}


