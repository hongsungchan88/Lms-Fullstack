# LMS Fullstack Project

학습 관리 시스템(LMS) 풀스택 프로젝트입니다.

## 기술 스택

### Backend
- Java 17
- Spring Boot 3.3.1
- Spring Data JPA
- Spring Security
- H2 Database (인메모리)
- Gradle

### Frontend
- React 18
- TypeScript
- Vite
- React Query (TanStack Query)
- Tailwind CSS
- React Router DOM

## 프로젝트 구조

```
Lms-Fullstack-main/
├── BackEnd/          # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/lms/
│   │   │   └── resources/
│   │   └── test/
│   └── build.gradle
│
└── FrontEnd/         # React 프론트엔드
    ├── src/
    │   ├── app/      # 라우팅 설정
    │   ├── entities/ # API 및 타입 정의
    │   ├── features/ # 기능별 모듈
    │   ├── pages/    # 페이지 컴포넌트
    │   ├── shared/   # 공통 유틸리티
    │   └── widgets/  # 위젯 컴포넌트
    ├── package.json
    └── vite.config.ts
```

## 주요 기능

### 관리자 (ADMIN)
- 회원 관리 (학생, 교사 통합 관리)
- 학생 관리
- 교사 관리
- 강의 개설 및 관리

### 교사 (TEACHER)
- 강의 관리
- 회차(강의 내용) 관리
- 과제 관리
- 공지사항 관리
- 학생 조회

### 학생 (STUDENT)
- 내 강의실 (수강 중인 강의 목록)
- 강의 상세 보기
- 강의 회차 조회
- 과제 제출
- 게시판 (질문 및 토론)
- 공지사항 확인

## 실행 방법

### Backend 실행
```bash
cd BackEnd
./gradlew bootRun
# 또는 Windows
gradlew.bat bootRun
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

### Frontend 실행
```bash
cd FrontEnd
npm install
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## 데이터베이스

H2 인메모리 데이터베이스를 사용합니다.
- H2 Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:lmsdb`
- Username: `sa`
- Password: (비어있음)

## API 엔드포인트

기본 API 경로: `http://localhost:8080/api`

### 인증
- `POST /api/user/login` - 로그인
- `POST /api/user/register` - 회원가입
- `POST /api/user/logout` - 로그아웃

### 학생
- `GET /api/students` - 전체 학생 조회
- `POST /api/students` - 학생 생성
- `PUT /api/students/{studentNumber}` - 학생 정보 수정

### 교사
- `GET /api/instructor` - 전체 교사 조회
- `POST /api/instructor/register` - 교사 생성
- `PUT /api/instructor/{instructorNumber}` - 교사 정보 수정

### 강의
- `GET /api/lecture` - 전체 강의 조회
- `GET /api/lecture/{id}` - 강의 상세 조회
- `POST /api/lecture` - 강의 생성
- `PUT /api/lecture/{id}` - 강의 수정

## 라이선스

이 프로젝트는 개인 학습 목적으로 제작되었습니다.

