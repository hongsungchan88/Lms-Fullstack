package com.lms.service;

import com.lms.domain.Instructor;
import com.lms.domain.Lecture;
import com.lms.dto.LectureDto;
import com.lms.repository.InstructorRepository;
import com.lms.repository.LectureRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class LectureService {

    private final LectureRepository lectureRepository;
    private final InstructorRepository instructorRepository;

    public LectureDto.LectureResponse createLecture(LectureDto.CreateRequest request) {
        Instructor instructor = instructorRepository.findById(request.getInstructorNumber())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강사 ID입니다."));

        Lecture lecture = Lecture.builder()
                .title(request.getTitle())
                .instructor(instructor)
                .totalLecture(request.getTotalLecture())
                .category(request.getCategory())
                .thumbnailUrl(request.getThumbnailUrl())
                .build();

        Lecture savedLecture = lectureRepository.save(lecture);
        return LectureDto.LectureResponse.from(savedLecture);
    }

    public LectureDto.LectureResponse getLecture(Long lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 강의를 찾을 수 없습니다."));
        return LectureDto.LectureResponse.from(lecture);
    }

    public java.util.List<LectureDto.LectureResponse> getAllLectures() {
        return lectureRepository.findAll().stream()
                .map(LectureDto.LectureResponse::from)
                .toList();
    }

    // 교사번호로 강의 목록 조회
    public java.util.List<LectureDto.LectureResponse> getLecturesByInstructor(Long instructorNumber) {
        return lectureRepository.findByInstructor_InstructorNumber(instructorNumber).stream()
                .map(LectureDto.LectureResponse::from)
                .toList();
    }

    // 강의 수정
    public LectureDto.LectureResponse updateLecture(Long lectureId, Long instructorNumber, LectureDto.UpdateRequest request) {
        Lecture lecture = lectureRepository.findByLectureIdAndInstructor_InstructorNumber(lectureId, instructorNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없거나 수정 권한이 없습니다."));

        lecture.update(request.getTitle(), request.getTotalLecture(), request.getCategory(), request.getThumbnailUrl());
        return LectureDto.LectureResponse.from(lecture);
    }

    // 강의 삭제
    public void deleteLecture(Long lectureId, Long instructorNumber) {
        Lecture lecture = lectureRepository.findByLectureIdAndInstructor_InstructorNumber(lectureId, instructorNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없거나 삭제 권한이 없습니다."));

        lectureRepository.delete(lecture);
    }

    // 관리자용: 강의 엔티티 조회 (내부 사용)
    public Lecture getLectureEntity(Long lectureId) {
        return lectureRepository.findById(lectureId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 강의를 찾을 수 없습니다."));
    }

    // 관리자용: 강의 수정 (권한 체크 없음)
    public LectureDto.LectureResponse updateLectureByAdmin(Long lectureId, LectureDto.UpdateRequest request) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 강의를 찾을 수 없습니다."));

        lecture.update(request.getTitle(), request.getTotalLecture(), request.getCategory(), request.getThumbnailUrl());
        return LectureDto.LectureResponse.from(lecture);
    }

    // 관리자용: 강의 삭제 (권한 체크 없음)
    public void deleteLectureByAdmin(Long lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 강의를 찾을 수 없습니다."));

        lectureRepository.delete(lecture);
    }
}