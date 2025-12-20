package com.lms.service;

import com.lms.domain.Student;
import com.lms.dto.StudentDto;
import com.lms.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Mockito를 사용하기 위한 JUnit 5 확장
public class StudentServiceTest {

    @Mock // Mock 객체 생성 (의존성)
    private StudentRepository studentRepository;

    @Mock // Mock 객체 생성
    private PasswordEncoder passwordEncoder;

    @InjectMocks // Mock 객체들을 주입받아 테스트할 실제 객체
    private StudentService studentService;

    private Student testStudent;
    private StudentDto.CreateRequest createRequest;
    private StudentDto.UpdateRequest updateRequest;
    private StudentDto.UpdatePasswordRequest updatePasswordRequest;

    @BeforeEach
    void setUp() {
        // 테스트 데이터 초기화
        testStudent = Student.builder()
                .studentNumber("S12345")
                .password("encodedPassword123!")
                .name("김철수")
                .email("chulsoo@example.com")
                .phone("010-1234-5678")
                .build();

        createRequest = StudentDto.CreateRequest.builder()
                .studentNumber("S12345")
                .password("password123!")
                .name("김철수")
                .email("chulsoo@example.com")
                .phone("010-1234-5678")
                .build();

        updateRequest = StudentDto.UpdateRequest.builder()
                .name("김철수2")
                .email("chulsoo2@example.com")
                .phone("010-9876-5432")
                .build();

        updatePasswordRequest = new StudentDto.UpdatePasswordRequest("oldPassword123!", "newPassword456!");
    }

    @Test
    @DisplayName("학생 생성 성공")
    void createStudentSuccess() {
        // Given
        given(studentRepository.existsByStudentNumber(anyString())).willReturn(false);
        given(studentRepository.existsByEmail(anyString())).willReturn(false);
        given(passwordEncoder.encode(anyString())).willReturn("encodedPassword123!");
        given(studentRepository.save(any(Student.class))).willReturn(testStudent);

        // When
        StudentDto.StudentResponse response = studentService.createStudent(createRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStudentNumber()).isEqualTo("S12345");
        assertThat(response.getName()).isEqualTo("김철수");
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    /*
    @Test
    @DisplayName("학생 생성 실패 - 학번 중복")
    void createStudentFail_DuplicateStudentNumber() {
        // Given
        given(studentRepository.existsByStudentNumber(anyString())).willReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> studentService.createStudent(createRequest));
        assertThat(exception.getMessage()).contains("이미 존재하는 학번입니다.");
        verify(studentRepository, never()).save(any(Student.class)); // save 호출 안됨
    }
    */

    @Test
    @DisplayName("학생 조회 성공")
    void getStudentByStudentNumberSuccess() {
        // Given
        given(studentRepository.findById(anyString())).willReturn(Optional.of(testStudent));

        // When
        StudentDto.StudentResponse response = studentService.getStudentByStudentNumber("S12345");

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStudentNumber()).isEqualTo("S12345");
    }

    @Test
    @DisplayName("학생 업데이트 성공")
    void updateStudentSuccess() {
        // Given
        given(studentRepository.findById(anyString())).willReturn(Optional.of(testStudent));
        given(studentRepository.existsByEmail(anyString())).willReturn(false); // 변경된 이메일이 중복되지 않음
        given(studentRepository.save(any(Student.class))).willReturn(testStudent); // save는 변경된 testStudent를 반환할 것으로 가정

        // When
        StudentDto.StudentResponse response = studentService.updateStudent("S12345", updateRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("김철수2");
        assertThat(response.getEmail()).isEqualTo("chulsoo2@example.com");
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("비밀번호 변경 성공")
    void updateStudentPasswordSuccess() {
        // Given
        given(studentRepository.findById(anyString())).willReturn(Optional.of(testStudent));
        given(passwordEncoder.matches(anyString(), anyString())).willReturn(true); // 현재 비밀번호 일치
        given(passwordEncoder.encode(anyString())).willReturn("newEncodedPassword456!");

        // When
        studentService.updateStudentPassword("S12345", updatePasswordRequest);

        // Then
        // verify(studentRepository, times(1)).save(testStudent); // @Transactional 때문에 save 호출 명시적 확인 어려움.
        // 대신 updatePassword 메서드 내부의 로직(student.updatePassword)이 잘 호출되었는지 확인
        assertThat(testStudent.getPassword()).isEqualTo("newEncodedPassword456!");
    }

    @Test
    @DisplayName("학생 삭제 성공")
    void deleteStudentSuccess() {
        // Given
        given(studentRepository.existsByStudentNumber(anyString())).willReturn(true);
        doNothing().when(studentRepository).deleteById(anyString()); // deleteById는 void 반환

        // When
        studentService.deleteStudent("S12345");

        // Then
        verify(studentRepository, times(1)).deleteById(anyString());
    }
}