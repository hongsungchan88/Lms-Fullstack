package com.lms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseTimeEntity {

    @CreatedDate
    @Column(updatable = false, name = "created_at") // 최초 생성 시간, 업데이트 불가
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at") // 최종 수정 시간
    private LocalDateTime updatedAt;
}