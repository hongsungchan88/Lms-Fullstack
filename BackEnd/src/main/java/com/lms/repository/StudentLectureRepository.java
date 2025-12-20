package com.lms.repository;

import com.lms.domain.StudentLecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentLectureRepository extends JpaRepository<StudentLecture, Long> {
    // 특정 학생이 특정 강의를 이미 수강하고 있는지 확인
    Optional<StudentLecture> findByStudent_StudentNumberAndLecture_LectureId(String studentNumber, Long lectureId);

    // 특정 학번(studentNumber)을 가진 학생의 모든 강의 목록을 조회하는 메서드
    List<StudentLecture> findByStudent_StudentNumber(String studentNumber);
}