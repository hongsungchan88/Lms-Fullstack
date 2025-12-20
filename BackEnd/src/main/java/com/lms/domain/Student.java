package com.lms.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 엔티티는 기본 생성자가 필요
@Table(name = "student") // 테이블 이름 명시
public class Student extends BaseTimeEntity {

    // student_number를 PK로 사용합니다.
    @Id
    @Column(name = "student_number", nullable = false, length = 30) // 학번 (varchar30)
    private String studentNumber;

    @Column(nullable = false, length = 100) // 비밀번호는 해시되어 저장되므로 길이를 늘림
    private String password;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, unique = true, length = 30) // 이메일은 유니크
    private String email;

    @Column(length = 20) // 전화번호 (int -> varchar로 변경, '010-' 등 문자 포함 가능성)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩 설정
    @JoinColumn(name = "departments_id", nullable = false) // 외래 키 컬럼 명시
    private Department department;

    // 만약 'id' 컬럼이 DB 내부적인 PK이고 student_number가 비즈니스 PK라면,
    // @Id를 id에 붙이고 @GeneratedValue(strategy = GenerationType.IDENTITY) 사용
    // 그리고 studentNumber에 @Column(unique = true)만 붙일 수 있습니다.
    // 여기서는 student_number를 직접 PK로 사용합니다.

    @Builder // 빌더 패턴을 통한 객체 생성
    public Student(String studentNumber, String password, String name, String email, String phone, Department department) {
        this.studentNumber = studentNumber;
        this.password = password; // 비밀번호는 반드시 서비스 계층에서 해싱되어야 합니다.
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department; // Department 객체 추가
    }

    // 학생 정보 업데이트 메서드 (비밀번호 제외)
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