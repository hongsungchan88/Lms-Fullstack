package com.lms.repository;

import com.lms.domain.LectureContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LectureContentRepository extends JpaRepository<LectureContent, Long> {
    
    List<LectureContent> findByLecture_LectureIdOrderBySessionNumberAsc(Long lectureId);
    
    Optional<LectureContent> findByLecture_LectureIdAndSessionNumber(Long lectureId, Integer sessionNumber);
    
    boolean existsByLecture_LectureIdAndSessionNumber(Long lectureId, Integer sessionNumber);
}


