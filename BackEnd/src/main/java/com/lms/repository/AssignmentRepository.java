package com.lms.repository;

import com.lms.domain.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByLecture_LectureIdOrderByCreatedAtDesc(Long lectureId);
}



