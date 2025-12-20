package com.lms.service;

import com.lms.domain.Assignment;
import com.lms.domain.AssignmentSubmission;
import com.lms.domain.Instructor;
import com.lms.domain.Lecture;
import com.lms.domain.Student;
import com.lms.dto.AssignmentDto;
import com.lms.repository.AssignmentRepository;
import com.lms.repository.AssignmentSubmissionRepository;
import com.lms.repository.InstructorRepository;
import com.lms.repository.LectureRepository;
import com.lms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@jakarta.transaction.Transactional
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final LectureRepository lectureRepository;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    private final FileStorageService fileStorageService;

    public AssignmentDto.AssignmentResponse createAssignment(AssignmentDto.CreateRequest request, MultipartFile file) {
        Lecture lecture = null;
        if (request.getLectureId() != null) {
            lecture = lectureRepository.findById(request.getLectureId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 ID의 강의를 찾을 수 없습니다."));
        }

        String filePath = null;
        String originalName = null;
        if (file != null && !file.isEmpty()) {
            filePath = fileStorageService.store(file, "assignments");
            originalName = file.getOriginalFilename();
        }

        Assignment assignment = Assignment.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .lecture(lecture)
                .filePath(filePath)
                .originalFileName(originalName)
                .maxScore(request.getMaxScore())
                .build();

        Assignment saved = assignmentRepository.save(assignment);
        return AssignmentDto.AssignmentResponse.from(saved);
    }

    public AssignmentDto.AssignmentResponse getAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 과제를 찾을 수 없습니다."));
        return AssignmentDto.AssignmentResponse.from(assignment);
    }

    public List<AssignmentDto.AssignmentResponse> getAssignmentsByLecture(Long lectureId) {
        return assignmentRepository.findByLecture_LectureIdOrderByCreatedAtDesc(lectureId).stream()
                .map(AssignmentDto.AssignmentResponse::from)
                .collect(Collectors.toList());
    }

    public AssignmentDto.AssignmentResponse updateAssignment(Long assignmentId, AssignmentDto.UpdateRequest request) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 과제를 찾을 수 없습니다."));
        
        assignment.update(request.getTitle(), request.getDescription(), request.getDueDate(),
                request.getFilePath(), request.getOriginalFileName(), request.getMaxScore());
        
        return AssignmentDto.AssignmentResponse.from(assignmentRepository.save(assignment));
    }

    public void deleteAssignment(Long assignmentId) {
        Optional<Assignment> assignmentOptional = assignmentRepository.findById(assignmentId);
        if (assignmentOptional.isEmpty()) {
            throw new IllegalArgumentException("해당 과제를 찾을 수 없습니다.");
        }
        Assignment assignment = assignmentOptional.get();
        assignmentRepository.deleteById(assignmentId);
        fileStorageService.delete(assignment.getFilePath());
    }

    // 과제 제출
    public AssignmentDto.SubmissionResponse submitAssignment(Long assignmentId, String studentNumber, AssignmentDto.SubmissionRequest request) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 과제를 찾을 수 없습니다."));
        
        Student student = studentRepository.findById(studentNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 학생을 찾을 수 없습니다."));

        AssignmentSubmission submission = submissionRepository
                .findByAssignment_AssignmentIdAndStudent_StudentNumber(assignmentId, studentNumber)
                .orElse(null);

        if (submission != null) {
            submission.updateSubmission(request.getContent(), request.getFilePath(), request.getOriginalFileName());
        } else {
            submission = AssignmentSubmission.builder()
                    .assignment(assignment)
                    .student(student)
                    .content(request.getContent())
                    .filePath(request.getFilePath())
                    .originalFileName(request.getOriginalFileName())
                    .build();
        }

        AssignmentSubmission saved = submissionRepository.save(submission);
        return AssignmentDto.SubmissionResponse.from(saved);
    }

    // 과제 제출 목록 조회 (교사용)
    public List<AssignmentDto.SubmissionResponse> getSubmissions(Long assignmentId) {
        return submissionRepository.findByAssignment_AssignmentId(assignmentId).stream()
                .map(AssignmentDto.SubmissionResponse::from)
                .collect(Collectors.toList());
    }

    // 학생의 제출 조회
    public AssignmentDto.SubmissionResponse getSubmission(Long assignmentId, String studentNumber) {
        AssignmentSubmission submission = submissionRepository
                .findByAssignment_AssignmentIdAndStudent_StudentNumber(assignmentId, studentNumber)
                .orElseThrow(() -> new IllegalArgumentException("제출한 과제를 찾을 수 없습니다."));
        return AssignmentDto.SubmissionResponse.from(submission);
    }

    // 과제 채점
    public AssignmentDto.SubmissionResponse gradeSubmission(Long submissionId, Long instructorNumber, AssignmentDto.GradeRequest request) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("제출한 과제를 찾을 수 없습니다."));

        Instructor instructor = instructorRepository.findById(instructorNumber)
                .orElseThrow(() -> new IllegalArgumentException("해당 교사를 찾을 수 없습니다."));

        submission.grade(request.getScore(), request.getFeedback(), instructor);
        AssignmentSubmission saved = submissionRepository.save(submission);
        return AssignmentDto.SubmissionResponse.from(saved);
    }
}

