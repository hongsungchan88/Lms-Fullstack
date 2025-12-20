package com.lms.repository;

import com.lms.domain.BoardPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardPostRepository extends JpaRepository<BoardPost, Long> {
    
    List<BoardPost> findByLecture_LectureIdOrderByCreatedAtDesc(Long lectureId);
    
    List<BoardPost> findByLecture_LectureIdAndCategoryOrderByCreatedAtDesc(Long lectureId, String category);
}



