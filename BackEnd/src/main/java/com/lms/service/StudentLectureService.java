package com.lms.service;

import com.lms.domain.Student;
import com.lms.domain.Lecture;
import com.lms.domain.StudentLecture;
import com.lms.dto.StudentLectureDto;
import com.lms.repository.StudentRepository;
import com.lms.repository.LectureRepository;
import com.lms.repository.StudentLectureRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentLectureService {

    private final StudentRepository studentRepository;
    private final LectureRepository lectureRepository;
    private final StudentLectureRepository studentLectureRepository;

    // 수강 신청 기능
    public StudentLectureDto.StudentLectureResponse enrollLecture(StudentLectureDto.EnrollRequest request) {
        // 1. 학생과 강의 존재 여부 확인
        Student student = studentRepository.findById(request.getStudentNumber())
                .orElseThrow(() -> new IllegalArgumentException("해당 학번의 학생을 찾을 수 없습니다."));

        Lecture lecture = lectureRepository.findById(request.getLectureId())
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 강의를 찾을 수 없습니다."));

        // 2. 이미 수강 중인지 확인
        if (studentLectureRepository.findByStudent_StudentNumberAndLecture_LectureId(request.getStudentNumber(), request.getLectureId()).isPresent()) {
            throw new IllegalArgumentException("이미 수강 신청된 강의입니다.");
        }

        // 3. 수강 신청
        // 수강 신청 시 진행도(progress)와 현재 수강 강의 수(currentLecture)를 초기화
        StudentLecture studentLecture = StudentLecture.builder()
                .student(student)
                .lecture(lecture)
                .progress(0) // 초기 진행도 0%
                .currentLecture(0) // 초기 수강 강의 수 0
                .build();

        StudentLecture savedStudentLecture = studentLectureRepository.save(studentLecture);

        // DTO로 변환 시 필요한 데이터들을 조합하여 반환
        return combineDataForResponse(savedStudentLecture);
    }

    // 여러 강의 동시 수강 신청
    public List<StudentLectureDto.StudentLectureResponse> enrollLectures(String studentNumber, List<Long> lectureIds) {
        return lectureIds.stream()
                .map(lectureId -> enrollLecture(StudentLectureDto.EnrollRequest.builder()
                        .studentNumber(studentNumber)
                        .lectureId(lectureId)
                        .build()))
                .collect(Collectors.toList());
    }

    // 학생이 수강하는 모든 강의 목록을 조회하는 메서드 (새로 추가)
    public List<StudentLectureDto.StudentLectureResponse> getStudentLectures(String studentNumber) {
        return studentLectureRepository.findByStudent_StudentNumber(studentNumber).stream()
                .map(this::combineDataForResponse)
                .collect(Collectors.toList());
    }

    // KPI 조회
    public StudentLectureDto.KpiResponse getKpis(String studentNumber) {
        List<StudentLecture> lectures = studentLectureRepository.findByStudent_StudentNumber(studentNumber);
        int total = lectures.size();
        int completed = (int) lectures.stream()
                .filter(sl -> sl.getProgress() != null && sl.getProgress() >= 100)
                .count();
        int inProgress = (int) lectures.stream()
                .filter(sl -> sl.getProgress() != null && sl.getProgress() > 0 && sl.getProgress() < 100)
                .count();

        return StudentLectureDto.KpiResponse.builder()
                .totalCourses(total)
                .completedCourses(completed)
                .inProgressCourses(inProgress)
                .build();
    }

    private StudentLectureDto.StudentLectureResponse combineDataForResponse(StudentLecture studentLecture) {
        // 프론트엔드 데이터에 맞춰 DTO를 구성
        return StudentLectureDto.StudentLectureResponse.builder()
                .studentLectureId(studentLecture.getStudentLectureId())
                .studentNumber(studentLecture.getStudent().getStudentNumber())
                .lectureId(studentLecture.getLecture().getLectureId())
                .createdAt(studentLecture.getCreatedAt())
                .title(studentLecture.getLecture().getTitle())
                .instructorName(studentLecture.getLecture().getInstructor().getName())
                .category(studentLecture.getLecture().getCategory())
                .totalLecture(studentLecture.getLecture().getTotalLecture())
                .thumbnailUrl(studentLecture.getLecture().getThumbnailUrl())
                .progress(defaultValue(studentLecture.getProgress()))
                .currentLecture(defaultValue(studentLecture.getCurrentLecture()))
                .nextLectureTitle(getNextLectureTitle(studentLecture.getLecture().getLectureId(), studentLecture.getCurrentLecture()))
                .build();
    }

    // 다음 강의 제목을 가져오는 임시 로직
    private String getNextLectureTitle(Long lectureId, Integer currentLecture) {
        // 실제로는 lectureId와 currentLecture를 기반으로 DB에서 다음 강의 제목을 찾아와야 합니다.
        // 현재는 임시로 고정된 값을 반환합니다.
        return "다음 강의 제목입니다.";
    }

    private int defaultValue(Integer value) {
        return value == null ? 0 : value;
    }

    // 진행도 업데이트
    public StudentLectureDto.StudentLectureResponse updateProgress(
            String studentNumber, Long lectureId, Integer progress, Integer currentLecture) {
        StudentLecture studentLecture = studentLectureRepository
                .findByStudent_StudentNumberAndLecture_LectureId(studentNumber, lectureId)
                .orElseThrow(() -> new IllegalArgumentException("해당 수강 정보를 찾을 수 없습니다."));

        studentLecture.updateProgress(progress, currentLecture);
        return combineDataForResponse(studentLecture);
    }
}