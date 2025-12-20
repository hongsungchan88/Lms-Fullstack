package com.lms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.config.TestSecurityConfig; // TestSecurityConfig 임포트
import com.lms.dto.StudentDto;
import com.lms.service.StudentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import; // Import 어노테이션 임포트
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class) // <--- 이 라인을 추가하여 테스트 보안 설정 로드
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/students - 학생 생성 성공")
    void createStudentSuccess() throws Exception {
        // Given
        StudentDto.CreateRequest request = StudentDto.CreateRequest.builder()
                .studentNumber("S001")
                .password("password123!")
                .name("홍길동")
                .email("hong@example.com")
                .phone("010-1111-2222")
                .build();

        StudentDto.StudentResponse response = StudentDto.StudentResponse.builder()
                .studentNumber("S001")
                .name("홍길동")
                .email("hong@example.com")
                .phone("010-1111-2222")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // studentService의 createStudent 메서드가 호출될 때 위에서 정의한 response 객체를 반환하도록 설정
        given(studentService.createStudent(any(StudentDto.CreateRequest.class))).willReturn(response);

        // When & Then
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated()) // HTTP 상태 코드 201 Created를 기대
                .andExpect(jsonPath("$.studentNumber").value("S001")) // 응답 JSON에 studentNumber가 "S001"인지 확인
                .andExpect(jsonPath("$.name").value("홍길동")); // 응답 JSON에 name이 "홍길동"인지 확인

        // studentService의 createStudent 메서드가 정확히 1번 호출되었는지 확인
        verify(studentService, times(1)).createStudent(any(StudentDto.CreateRequest.class));
    }

    @Test
    @DisplayName("GET /api/students/{studentNumber} - 학생 조회 성공")
    void getStudentByStudentNumberSuccess() throws Exception {
        // Given
        String studentNumber = "S001";
        StudentDto.StudentResponse response = StudentDto.StudentResponse.builder()
                .studentNumber(studentNumber)
                .name("홍길동")
                .email("hong@example.com")
                .phone("010-1111-2222")
                .createdAt(LocalDateTime.now()) // Auditing 필드 추가
                .updatedAt(LocalDateTime.now()) // Auditing 필드 추가
                .build();

        // studentService의 getStudentByStudentNumber 메서드가 호출될 때 response 객체를 반환하도록 설정
        given(studentService.getStudentByStudentNumber(studentNumber)).willReturn(response);

        // When & Then
        mockMvc.perform(get("/api/students/{studentNumber}", studentNumber)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // HTTP 상태 코드 200 OK를 기대
                .andExpect(jsonPath("$.studentNumber").value(studentNumber))
                .andExpect(jsonPath("$.name").value("홍길동"));

        // studentService의 getStudentByStudentNumber 메서드가 정확히 1번 호출되었는지 확인
        verify(studentService, times(1)).getStudentByStudentNumber(studentNumber);
    }

    @Test
    @DisplayName("PUT /api/students/{studentNumber} - 학생 정보 업데이트 성공")
    void updateStudentSuccess() throws Exception {
        // Given
        String studentNumber = "S001";
        StudentDto.UpdateRequest request = StudentDto.UpdateRequest.builder()
                .name("이몽룡")
                .email("mongryong@example.com")
                .phone("010-3333-4444")
                .build();

        StudentDto.StudentResponse updatedResponse = StudentDto.StudentResponse.builder()
                .studentNumber(studentNumber)
                .name("이몽룡")
                .email("mongryong@example.com")
                .phone("010-3333-4444")
                .createdAt(LocalDateTime.now().minusDays(1)) // 기존 데이터라고 가정
                .updatedAt(LocalDateTime.now()) // 업데이트 시간
                .build();

        // studentService의 updateStudent 메서드가 호출될 때 updatedResponse 객체를 반환하도록 설정
        given(studentService.updateStudent(eq(studentNumber), any(StudentDto.UpdateRequest.class)))
                .willReturn(updatedResponse);

        // When & Then
        mockMvc.perform(put("/api/students/{studentNumber}", studentNumber)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()) // HTTP 상태 코드 200 OK를 기대
                .andExpect(jsonPath("$.name").value("이몽룡"))
                .andExpect(jsonPath("$.email").value("mongryong@example.com"));

        // studentService의 updateStudent 메서드가 정확히 1번 호출되었는지 확인
        verify(studentService, times(1)).updateStudent(eq(studentNumber), any(StudentDto.UpdateRequest.class));
    }

    @Test
    @DisplayName("PATCH /api/students/{studentNumber}/password - 학생 비밀번호 변경 성공")
    void updateStudentPasswordSuccess() throws Exception {
        // Given
        String studentNumber = "S001";
        StudentDto.UpdatePasswordRequest request = new StudentDto.UpdatePasswordRequest("oldPassword123!", "newPassword456!");

        // studentService의 updateStudentPassword 메서드가 호출될 때 아무것도 반환하지 않도록 설정
        // (void 메서드에 대한 mocking)
        doNothing().when(studentService).updateStudentPassword(eq(studentNumber), any(StudentDto.UpdatePasswordRequest.class));

        // When & Then
        mockMvc.perform(patch("/api/students/{studentNumber}/password", studentNumber)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent()); // HTTP 상태 코드 204 No Content를 기대

        // studentService의 updateStudentPassword 메서드가 정확히 1번 호출되었는지 확인
        verify(studentService, times(1)).updateStudentPassword(eq(studentNumber), any(StudentDto.UpdatePasswordRequest.class));
    }


    @Test
    @DisplayName("DELETE /api/students/{studentNumber} - 학생 삭제 성공")
    void deleteStudentSuccess() throws Exception {
        // Given
        String studentNumber = "S001";
        // studentService의 deleteStudent 메서드가 호출될 때 아무것도 반환하지 않도록 설정
        doNothing().when(studentService).deleteStudent(studentNumber);

        // When & Then
        mockMvc.perform(delete("/api/students/{studentNumber}", studentNumber))
                .andExpect(status().isNoContent()); // HTTP 상태 코드 204 No Content를 기대

        // studentService의 deleteStudent 메서드가 정확히 1번 호출되었는지 확인
        verify(studentService, times(1)).deleteStudent(studentNumber);
    }

    @Test
    @DisplayName("POST /api/students - 학생 생성 실패 (필수 필드 누락)")
    void createStudentFail_Validation() throws Exception {
        // Given
        StudentDto.CreateRequest invalidRequest = StudentDto.CreateRequest.builder()
                .studentNumber("S002")
                // password, name, email 필드를 의도적으로 누락
                .build();

        // When & Then
        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest()) // HTTP 상태 코드 400 Bad Request를 기대
                .andExpect(jsonPath("$.password").exists()) // 응답 JSON에 password 필드에 대한 오류 메시지가 있는지 확인
                .andExpect(jsonPath("$.name").exists())     // 응답 JSON에 name 필드에 대한 오류 메시지가 있는지 확인
                .andExpect(jsonPath("$.email").exists());   // 응답 JSON에 email 필드에 대한 오류 메시지가 있는지 확인

        // 이 경우는 유효성 검사 실패이므로, 서비스 메서드는 호출되지 않아야 합니다.
        verify(studentService, never()).createStudent(any(StudentDto.CreateRequest.class));
    }
}