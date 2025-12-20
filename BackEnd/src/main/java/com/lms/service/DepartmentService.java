package com.lms.service;

import com.lms.domain.Department;
import com.lms.dto.DepartmentDto;
import com.lms.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    // 학과 등록
    public DepartmentDto.DepartmentResponse createDepartment(DepartmentDto.CreateRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("이미 존재하는 학과명입니다.");
        }
        Department department = Department.builder()
                .name(request.getName())
                .build();
        Department savedDepartment = departmentRepository.save(department);
        return DepartmentDto.DepartmentResponse.from(savedDepartment);
    }

    // 모든 학과 조회
    public List<DepartmentDto.DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentDto.DepartmentResponse::from)
                .collect(Collectors.toList());
    }
}