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
@Table(name = "admins")
public class Admin extends BaseTimeEntity {

    @Id
    @Column(name = "admin_id", nullable = false, length = 30)
    private String adminId;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, unique = true, length = 30)
    private String email;

    @Column(length = 20)
    private String phone;

    @Builder
    public Admin(String adminId, String password, String name, String email, String phone) {
        this.adminId = adminId;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    public void update(String name, String email, String phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}


