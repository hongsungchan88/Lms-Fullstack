package com.lms.repository;

import com.lms.domain.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {
    
    Optional<Admin> findByAdminId(String adminId);
    
    boolean existsByAdminId(String adminId);
    
    boolean existsByEmail(String email);
    
    Optional<Admin> findByEmail(String email);
}


