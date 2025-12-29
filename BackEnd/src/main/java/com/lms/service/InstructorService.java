package com.lms.service;

import com.lms.domain.Instructor;
import com.lms.dto.InstructorDto;
import com.lms.repository.InstructorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InstructorService {

    private final InstructorRepository instructorRepository;

    // 교사 등록
    public InstructorDto.InstructorResponse createInstructor(InstructorDto.CreateRequest request) {
        // 교사번호 중복 확인
        if (instructorRepository.existsByInstructorNumber(request.getInstructorNumber())) {
            throw new IllegalArgumentException("이미 존재하는 교사번호입니다: " + request.getInstructorNumber());
        }
        // 이메일 중복 확인
        if (instructorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + request.getEmail());
        }

        Instructor instructor = Instructor.builder()
                .instructorNumber(request.getInstructorNumber())
                .password(request.getPassword())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        Instructor savedInstructor = instructorRepository.save(instructor);
        return InstructorDto.InstructorResponse.from(savedInstructor);
    }

    // 회원 가입 (프론트 전용 별도 메서드)
    public InstructorDto.InstructorResponse register(InstructorDto.RegisterRequest request) {
        InstructorDto.CreateRequest createRequest = InstructorDto.CreateRequest.builder()
                .instructorNumber(request.getInstructorNumber())
                .password(request.getPassword())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        return createInstructor(createRequest);
    }

    // 로그인
    public InstructorDto.LoginResponse login(InstructorDto.LoginRequest request) {
        Instructor instructor = instructorRepository.findByInstructorNumber(request.getInstructorNumber())
                .orElseThrow(() -> new IllegalArgumentException("해당 교사번호의 교사를 찾을 수 없습니다: " + request.getInstructorNumber()));

        if (!request.getPassword().equals(instructor.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return InstructorDto.LoginResponse.builder()
                .user(InstructorDto.InstructorResponse.from(instructor))
                .message("로그인 성공")
                .role("TEACHER")
                .build();
    }

    // 교사번호 중복 체크
    public InstructorDto.CheckIdResponse checkId(InstructorDto.CheckIdRequest request) {
        boolean exists = instructorRepository.existsByInstructorNumber(request.getInstructorNumber());
        return InstructorDto.CheckIdResponse.builder()
                .available(!exists)
                .build();
    }

    public List<InstructorDto.InstructorResponse> getInstructors(Long instructorNumber) {
        if (instructorNumber == null) {
            return getAllInstructors();
        }
        return List.of(getInstructorByInstructorNumber(instructorNumber));
    }

    // 모든 교사 조회
    public List<InstructorDto.InstructorResponse> getAllInstructors() {
        return instructorRepository.findAll().stream()
                .map(InstructorDto.InstructorResponse::from)
                .collect(Collectors.toList());
    }

    // 교사번호로 교사 조회
    public InstructorDto.InstructorResponse getInstructorByInstructorNumber(Long instructorNumber) {
        Instructor instructor = instructorRepository.findByInstructorNumber(instructorNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 교사번호의 교사를 찾을 수 없습니다: " + instructorNumber));
        return InstructorDto.InstructorResponse.from(instructor);
    }

    // 교사 정보 업데이트 (이메일 포함 가능, 교사번호는 변경 불가)
    public InstructorDto.InstructorResponse updateInstructor(Long instructorNumber, InstructorDto.UpdateRequest request) {
        Instructor instructor = instructorRepository.findByInstructorNumber(instructorNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 교사번호의 교사를 찾을 수 없습니다: " + instructorNumber));

        // 이메일 변경 시 중복 확인 (본인 이메일 제외)
        if (!instructor.getEmail().equals(request.getEmail()) && instructorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + request.getEmail());
        }

        instructor.update(request.getName(), request.getEmail(), request.getPhone());
        Instructor updatedInstructor = instructorRepository.save(instructor);
        return InstructorDto.InstructorResponse.from(updatedInstructor);
    }

    // 교사 비밀번호 변경
    public void updateInstructorPassword(Long instructorNumber, InstructorDto.UpdatePasswordRequest request) {
        Instructor instructor = instructorRepository.findByInstructorNumber(instructorNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 교사번호의 교사를 찾을 수 없습니다: " + instructorNumber));

        // 현재 비밀번호 확인
        if (!request.getCurrentPassword().equals(instructor.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 업데이트
        instructor.updatePassword(request.getNewPassword());
    }

    // 교사 삭제
    public void deleteInstructor(Long instructorNumber) {
        if (!instructorRepository.existsByInstructorNumber(instructorNumber)) {
            throw new IllegalArgumentException("해당 교사번호의 교사를 찾을 수 없어 삭제할 수 없습니다: " + instructorNumber);
        }
        instructorRepository.deleteById(instructorNumber);
    }
}

