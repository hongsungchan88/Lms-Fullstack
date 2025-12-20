package com.lms.repository;

import com.lms.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByPost_PostIdOrderByCreatedAtAsc(Long postId);
    
    List<Comment> findByPost_PostIdAndParentCommentIsNullOrderByCreatedAtAsc(Long postId);
    
    List<Comment> findByParentComment_CommentIdOrderByCreatedAtAsc(Long parentCommentId);
}


