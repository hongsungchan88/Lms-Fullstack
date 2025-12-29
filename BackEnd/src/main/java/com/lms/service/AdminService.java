package com.lms.service;

import com.lms.domain.Admin;
import com.lms.dto.AdminDto;
import com.lms.repository.AdminRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final AdminRepository adminRepository;

    // 관리자 생성 (초기 설정용)
    public AdminDto.AdminResponse createAdmin(AdminDto.CreateRequest request) {
        if (adminRepository.existsByAdminId(request.getAdminId())) {
            throw new IllegalArgumentException("이미 존재하는 관리자 ID입니다.");
        }
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        Admin admin = Admin.builder()
                .adminId(request.getAdminId())
                .password(request.getPassword())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        Admin savedAdmin = adminRepository.save(admin);
        return AdminDto.AdminResponse.from(savedAdmin);
    }

    // 관리자 등록
    public AdminDto.AdminResponse register(AdminDto.RegisterRequest request) {
        if (adminRepository.existsByAdminId(request.getAdminId())) {
            throw new IllegalArgumentException("이미 존재하는 관리자 ID입니다.");
        }
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        Admin admin = Admin.builder()
                .adminId(request.getAdminId())
                .password(request.getPassword())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        Admin savedAdmin = adminRepository.save(admin);
        return AdminDto.AdminResponse.from(savedAdmin);
    }

    // 관리자 로그인
    public AdminDto.LoginResponse login(AdminDto.LoginRequest request) {
        Admin admin = adminRepository.findByAdminId(request.getAdminId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 ID입니다."));

        if (!request.getPassword().equals(admin.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return AdminDto.LoginResponse.builder()
                .user(AdminDto.AdminResponse.from(admin))
                .message("로그인 성공")
                .role("ADMIN")
                .build();
    }

    // 모든 관리자 조회
    public List<AdminDto.AdminResponse> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(AdminDto.AdminResponse::from)
                .collect(Collectors.toList());
    }

    // 관리자 ID로 조회
    public AdminDto.AdminResponse getAdminByAdminId(String adminId) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 ID입니다."));
        return AdminDto.AdminResponse.from(admin);
    }

    // 관리자 정보 업데이트
    public AdminDto.AdminResponse updateAdmin(String adminId, AdminDto.UpdateRequest request) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 ID입니다."));

        // 이메일 중복 확인 (본인 제외)
        if (!admin.getEmail().equals(request.getEmail()) && adminRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        admin.update(request.getName(), request.getEmail(), request.getPhone());
        return AdminDto.AdminResponse.from(admin);
    }

    // 관리자 비밀번호 변경
    public void updateAdminPassword(String adminId, AdminDto.UpdatePasswordRequest request) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 ID입니다."));

        if (!request.getCurrentPassword().equals(admin.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        admin.updatePassword(request.getNewPassword());
    }

    // 관리자 삭제
    public void deleteAdmin(String adminId) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자 ID입니다."));
        adminRepository.delete(admin);
    }
}


