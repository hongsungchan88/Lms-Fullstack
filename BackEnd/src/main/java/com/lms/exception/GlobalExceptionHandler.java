package com.lms.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // @Valid 유효성 검사 실패 시
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        log.warn("Validation error occurred: {}", errors);
        return ResponseEntity.badRequest().body(errors); // 400 Bad Request
    }

    // IllegalArgumentException (서비스 계층에서 발생시키는 비즈니스 예외)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Business logic error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage()); // 400 Bad Request
    }

    // 리소스를 찾을 수 없을 때 (404 Not Found)
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoResourceFoundException(NoResourceFoundException ex) {
        log.warn("Resource not found: {}", ex.getResourcePath());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "요청하신 경로를 찾을 수 없습니다.");
        response.put("path", ex.getResourcePath());
        response.put("availableEndpoints", Map.of(
                "user", "/api/user",
                "students", "/api/students",
                "instructor", "/api/instructor",
                "h2-console", "/h2-console"
        ));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // 404 Not Found
    }

    // 기타 모든 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllUncaughtException(Exception ex) {
        log.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다."); // 500 Internal Server Error
    }
}