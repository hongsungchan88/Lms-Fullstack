package com.lms.config; // main 패키지와 동일하게 설정하여 Bean을 찾기 쉽게 합니다.

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // AbstractHttpConfigurer 임포트
import org.springframework.security.web.SecurityFilterChain;

@TestConfiguration // 테스트 전용 설정임을 나타냅니다.
public class TestSecurityConfig {

    @Bean
    @Primary // 여러 SecurityFilterChain 빈이 있을 때 이 빈을 우선적으로 사용하도록 합니다.
    public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
        // 모든 요청에 대해 인증/권한 검사, CSRF 보호를 비활성화합니다.
        // 테스트 환경에서만 적용됩니다.
        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 보호 비활성화
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll() // 모든 요청 허용
                );
        return http.build();
    }
}