package com.lms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "departments")
public class Department extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // departments_id는 자동(AUTO)으로 생성되도록 설정
    @Column(name = "departments_id", nullable = false)
    private Long departmentsId;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Builder
    public Department(String name) {
        this.name = name;
    }
}