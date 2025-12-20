package com.lms.repository;

import com.lms.domain.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    
    // 교사번호로 강의 목록 조회
    List<Lecture> findByInstructor_InstructorNumber(Long instructorNumber);
    
    // 강의 ID와 교사번호로 강의 조회 (권한 확인용)
    Optional<Lecture> findByLectureIdAndInstructor_InstructorNumber(Long lectureId, Long instructorNumber);
}