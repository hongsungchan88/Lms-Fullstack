package com.lms.service;

import com.lms.domain.Department;
import com.lms.domain.Student;
import com.lms.dto.StudentDto;
import com.lms.repository.DepartmentRepository;
import com.lms.repository.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Lombok: final 필드에 대한 생성자를 자동으로 생성하여 의존성 주입
@Transactional // Spring의 @Transactional: 메서드 실행 중 예외 발생 시 롤백
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository; // DepartmentRepository 주입

    // 학생 등록
    public StudentDto.StudentResponse createStudent(StudentDto.CreateRequest request) {
        // 학번 중복 확인
        if (studentRepository.existsByStudentNumber(request.getStudentNumber())) {
            throw new IllegalArgumentException("이미 존재하는 학번입니다: " + request.getStudentNumber());
        }
        // 이메일 중복 확인
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + request.getEmail());
        }

        // 학과 존재 여부 확인
        Department department = departmentRepository.findById(request.getDepartmentsId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 학과 ID입니다."));

        Student student = Student.builder()
                .studentNumber(request.getStudentNumber())
                .password(request.getPassword())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(department)
                .build();

        Student savedStudent = studentRepository.save(student);
        return StudentDto.StudentResponse.from(savedStudent);
    }

    // 회원 가입 (프론트 전용 별도 메서드)
    public StudentDto.StudentResponse register(StudentDto.RegisterRequest request) {
        StudentDto.CreateRequest createRequest = StudentDto.CreateRequest.builder()
                .studentNumber(request.getStudentNumber())
                .password(request.getPassword())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .departmentsId(request.getDepartmentsId())
                .build();
        return createStudent(createRequest);
    }

    // 로그인
    public StudentDto.LoginResponse login(StudentDto.LoginRequest request) {
        Student student = studentRepository.findById(request.getStudentNumber())
                .orElseThrow(() -> new IllegalArgumentException("해당 학번의 학생을 찾을 수 없습니다: " + request.getStudentNumber()));

        if (!request.getPassword().equals(student.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return StudentDto.LoginResponse.builder()
                .user(StudentDto.StudentResponse.from(student))
                .message("로그인 성공")
                .role("STUDENT")
                .build();
    }

    // 학번 중복 체크
    public StudentDto.CheckIdResponse checkId(StudentDto.CheckIdRequest request) {
        boolean exists = studentRepository.existsByStudentNumber(request.getStudentNumber());
        return StudentDto.CheckIdResponse.builder()
                .available(!exists)
                .build();
    }

    public List<StudentDto.StudentResponse> getStudents(String studentNumber) {
        if (studentNumber == null || studentNumber.isBlank()) {
            return getAllStudents();
        }
        return List.of(getStudentByStudentNumber(studentNumber));
    }

    // 모든 학생 조회
    public List<StudentDto.StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentDto.StudentResponse::from)
                .collect(Collectors.toList());
    }

    // 학번으로 학생 조회
    public StudentDto.StudentResponse getStudentByStudentNumber(String studentNumber) {
        Student student = studentRepository.findById(studentNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 학번의 학생을 찾을 수 없습니다: " + studentNumber));
        return StudentDto.StudentResponse.from(student);
    }

    // 학생 정보 업데이트 (이메일 포함 가능, 학번은 변경 불가)
    public StudentDto.StudentResponse updateStudent(String studentNumber, StudentDto.UpdateRequest request) {
        Student student = studentRepository.findById(studentNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 학번의 학생을 찾을 수 없습니다: " + studentNumber));

        // 이메일 변경 시 중복 확인 (본인 이메일 제외)
        if (!student.getEmail().equals(request.getEmail()) && studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + request.getEmail());
        }

        student.update(request.getName(), request.getEmail(), request.getPhone());
        Student updatedStudent = studentRepository.save(student); // 변경 감지(Dirty Checking)로 자동 저장될 수도 있지만 명시적으로 호출
        return StudentDto.StudentResponse.from(updatedStudent);
    }

    // 학생 비밀번호 변경
    public void updateStudentPassword(String studentNumber, StudentDto.UpdatePasswordRequest request) {
        Student student = studentRepository.findById(studentNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 학번의 학생을 찾을 수 없습니다: " + studentNumber));

        // 현재 비밀번호 확인
        if (!request.getCurrentPassword().equals(student.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 업데이트
        student.updatePassword(request.getNewPassword());
        // studentRepository.save(student); // @Transactional에 의해 변경 감지되어 자동 저장
    }

    // 학생 삭제
    public void deleteStudent(String studentNumber) {
        if (!studentRepository.existsByStudentNumber(studentNumber)) {
            throw new IllegalArgumentException("해당 학번의 학생을 찾을 수 없어 삭제할 수 없습니다: " + studentNumber);
        }
        studentRepository.deleteById(studentNumber);
    }
}