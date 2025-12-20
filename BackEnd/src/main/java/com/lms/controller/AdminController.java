package com.lms.controller;

import com.lms.dto.AdminDto;
import com.lms.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminDto.AdminResponse>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping("/register")
    public ResponseEntity<AdminDto.AdminResponse> register(@Valid @RequestBody AdminDto.RegisterRequest request) {
        AdminDto.AdminResponse response = adminService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AdminDto.LoginResponse> login(@Valid @RequestBody AdminDto.LoginRequest request) {
        AdminDto.LoginResponse response = adminService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<AdminDto.AdminResponse> getAdmin(@PathVariable String adminId) {
        return ResponseEntity.ok(adminService.getAdminByAdminId(adminId));
    }

    @PutMapping("/{adminId}")
    public ResponseEntity<AdminDto.AdminResponse> updateAdmin(
            @PathVariable String adminId,
            @Valid @RequestBody AdminDto.UpdateRequest request) {
        AdminDto.AdminResponse response = adminService.updateAdmin(adminId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{adminId}/password")
    public ResponseEntity<Void> updateAdminPassword(
            @PathVariable String adminId,
            @Valid @RequestBody AdminDto.UpdatePasswordRequest request) {
        adminService.updateAdminPassword(adminId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{adminId}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String adminId) {
        adminService.deleteAdmin(adminId);
        return ResponseEntity.noContent().build();
    }
}


