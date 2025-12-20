package com.lms.repository;

import com.lms.domain.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    
    // 교사번호로 교사 찾기
    Optional<Instructor> findByInstructorNumber(Long instructorNumber);
    
    // 교사번호 존재 여부 확인
    boolean existsByInstructorNumber(Long instructorNumber);
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
    
    // 이메일로 교사 찾기
    Optional<Instructor> findByEmail(String email);
}