package com.lms.controller;

import com.lms.dto.StudentDto;
import com.lms.dto.InstructorDto;
import com.lms.dto.AdminDto;
import com.lms.dto.UserDto;
import com.lms.service.StudentService;
import com.lms.service.InstructorService;
import com.lms.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final StudentService studentService;
    private final InstructorService instructorService;
    private final AdminService adminService;

        @GetMapping
        public ResponseEntity<UserDto.UnifiedUserResponse> getUser(
                @RequestParam(value = "id", required = false) String id,
                @RequestParam(value = "role", required = false) String role) {
            if (id == null || role == null) {
                // 파라미터가 없으면 빈 응답 반환 (프론트엔드에서 로그인 정보 사용)
                return ResponseEntity.ok(UserDto.UnifiedUserResponse.builder()
                        .user(null)
                        .role(null)
                        .build());
            }

            if ("ADMIN".equalsIgnoreCase(role)) {
                AdminDto.AdminResponse admin = adminService.getAdminByAdminId(id);
                return ResponseEntity.ok(UserDto.UnifiedUserResponse.builder()
                        .user(admin)
                        .role("ADMIN")
                        .build());
            } else if ("TEACHER".equalsIgnoreCase(role)) {
                try {
                    Long instructorNumber = Long.parseLong(id);
                    InstructorDto.InstructorResponse instructor = instructorService.getInstructorByInstructorNumber(instructorNumber);
                    return ResponseEntity.ok(UserDto.UnifiedUserResponse.builder()
                            .user(instructor)
                            .role("TEACHER")
                            .build());
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("교사번호는 숫자여야 합니다.");
                }
            } else {
                StudentDto.StudentResponse student = studentService.getStudentByStudentNumber(id);
                return ResponseEntity.ok(UserDto.UnifiedUserResponse.builder()
                        .user(student)
                        .role("STUDENT")
                        .build());
            }
        }

    @PostMapping("/register")
    public ResponseEntity<StudentDto.StudentResponse> register(@Valid @RequestBody StudentDto.RegisterRequest request) {
        StudentDto.StudentResponse response = studentService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto.UnifiedLoginResponse> login(@Valid @RequestBody UserDto.UnifiedLoginRequest request) {
        UserDto.UnifiedLoginResponse response;
        
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            // 관리자 로그인
            AdminDto.LoginRequest adminRequest = new AdminDto.LoginRequest();
            adminRequest.setAdminId(request.getId());
            adminRequest.setPassword(request.getPassword());
            
            AdminDto.LoginResponse adminResponse = adminService.login(adminRequest);
            response = UserDto.UnifiedLoginResponse.builder()
                    .user(adminResponse.getUser())
                    .message(adminResponse.getMessage())
                    .role(adminResponse.getRole())
                    .build();
        } else if ("TEACHER".equalsIgnoreCase(request.getRole())) {
            // 교사 로그인
            InstructorDto.LoginRequest instructorRequest = new InstructorDto.LoginRequest();
            try {
                instructorRequest.setInstructorNumber(Long.parseLong(request.getId()));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("교사번호는 숫자여야 합니다.");
            }
            instructorRequest.setPassword(request.getPassword());
            
            InstructorDto.LoginResponse instructorResponse = instructorService.login(instructorRequest);
            response = UserDto.UnifiedLoginResponse.builder()
                    .user(instructorResponse.getUser())
                    .message(instructorResponse.getMessage())
                    .role(instructorResponse.getRole())
                    .build();
        } else {
            // 학생 로그인 (기본값)
            StudentDto.LoginRequest studentRequest = new StudentDto.LoginRequest();
            studentRequest.setStudentNumber(request.getId());
            studentRequest.setPassword(request.getPassword());
            
            StudentDto.LoginResponse studentResponse = studentService.login(studentRequest);
            response = UserDto.UnifiedLoginResponse.builder()
                    .user(studentResponse.getUser())
                    .message(studentResponse.getMessage())
                    .role(studentResponse.getRole())
                    .build();
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-id")
    public ResponseEntity<StudentDto.CheckIdResponse> checkId(@Valid @RequestBody StudentDto.CheckIdRequest request) {
        return ResponseEntity.ok(studentService.checkId(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout() {
        // 세션 기반 인증이 아닌 경우 단순히 성공 응답 반환
        // 실제로는 세션 무효화 등의 로직이 필요할 수 있음
        return ResponseEntity.ok(java.util.Map.of("message", "로그아웃 성공"));
    }
}



