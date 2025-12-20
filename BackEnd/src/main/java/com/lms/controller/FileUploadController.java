package com.lms.controller;

import com.lms.service.FileStorageService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(@RequestPart("file") MultipartFile file) {
        String path = fileStorageService.store(file, "board");
        return ResponseEntity.status(HttpStatus.CREATED).body(new FileUploadResponse(path));
    }

    @Data
    @AllArgsConstructor
    static class FileUploadResponse {
        private String path;
    }
}



