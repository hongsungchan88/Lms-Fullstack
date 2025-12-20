package com.lms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "instructors")
public class Instructor extends BaseTimeEntity {

    @Id
    @Column(name = "instructor_number", nullable = false)
    private Long instructorNumber;

    @Column(nullable = false, length = 100) // 비밀번호는 해시되어 저장되므로 길이를 늘림
    private String password;

    @Column(name = "name", nullable = false, length = 30)
    private String name;

    @Column(nullable = false, unique = true, length = 30) // 이메일은 유니크
    private String email;

    @Column(length = 20) // 전화번호
    private String phone;

    @Builder
    public Instructor(Long instructorNumber, String password, String name, String email, String phone) {
        this.instructorNumber = instructorNumber;
        this.password = password; // 비밀번호는 반드시 서비스 계층에서 해싱되어야 합니다.
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    // 교사 정보 업데이트 메서드 (비밀번호 제외)
    public void update(String name, String email, String phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    // 비밀번호 변경 메서드
    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}