package com.lms.service;

import com.lms.domain.Lecture;
import com.lms.domain.LectureContent;
import com.lms.dto.LectureContentDto;
import com.lms.repository.LectureContentRepository;
import com.lms.repository.LectureRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LectureContentService {

    private final LectureContentRepository lectureContentRepository;
    private final LectureRepository lectureRepository;

    public LectureContentDto.LectureContentResponse createContent(LectureContentDto.CreateRequest request) {
        Lecture lecture = lectureRepository.findById(request.getLectureId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의 ID입니다."));

        if (lectureContentRepository.existsByLecture_LectureIdAndSessionNumber(request.getLectureId(), request.getSessionNumber())) {
            throw new IllegalArgumentException("이미 존재하는 회차 번호입니다.");
        }

        LectureContent content = LectureContent.builder()
                .lecture(lecture)
                .sessionNumber(request.getSessionNumber())
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .videoDuration(request.getVideoDuration())
                .materialUrl(request.getMaterialUrl())
                .materialFileName(request.getMaterialFileName())
                .notes(request.getNotes())
                .learningObjectives(request.getLearningObjectives())
                .build();

        LectureContent savedContent = lectureContentRepository.save(content);
        return LectureContentDto.LectureContentResponse.from(savedContent);
    }

    public List<LectureContentDto.LectureContentResponse> getContentsByLecture(Long lectureId) {
        return lectureContentRepository.findByLecture_LectureIdOrderBySessionNumberAsc(lectureId).stream()
                .map(LectureContentDto.LectureContentResponse::from)
                .collect(Collectors.toList());
    }

    public LectureContentDto.LectureContentResponse getContent(Long contentId) {
        LectureContent content = lectureContentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의 회차입니다."));
        return LectureContentDto.LectureContentResponse.from(content);
    }

    public LectureContentDto.LectureContentResponse updateContent(Long contentId, LectureContentDto.UpdateRequest request) {
        LectureContent content = lectureContentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의 회차입니다."));

        content.update(request.getTitle(), request.getDescription(), request.getVideoUrl(),
                request.getVideoDuration(), request.getMaterialUrl(), request.getMaterialFileName(),
                request.getNotes(), request.getLearningObjectives());

        return LectureContentDto.LectureContentResponse.from(lectureContentRepository.save(content));
    }

    public void deleteContent(Long contentId) {
        LectureContent content = lectureContentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의 회차입니다."));
        lectureContentRepository.delete(content);
    }
}


