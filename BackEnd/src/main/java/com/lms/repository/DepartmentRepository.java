package com.lms.repository;

import com.lms.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    // 학과명으로 학과 존재 여부를 확인하는 메서드
    boolean existsByName(String name);
}