package com.lms.repository;

import com.lms.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, String> { // Student, PK 타입

    // 이메일로 학생을 찾는 메서드 (로그인 등 활용)
    Optional<Student> findByEmail(String email);

    // 학번 존재 여부 확인
    boolean existsByStudentNumber(String studentNumber);

    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
}