package com.lms.repository;

import com.lms.domain.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    
    List<AssignmentSubmission> findByAssignment_AssignmentId(Long assignmentId);
    
    Optional<AssignmentSubmission> findByAssignment_AssignmentIdAndStudent_StudentNumber(Long assignmentId, String studentNumber);
    
    List<AssignmentSubmission> findByStudent_StudentNumber(String studentNumber);
    
    boolean existsByAssignment_AssignmentIdAndStudent_StudentNumber(Long assignmentId, String studentNumber);
}


