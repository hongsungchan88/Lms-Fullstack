export interface AssignmentResponse {
  assignmentId: number;
  title: string;
  description?: string;
  dueDate: string;
  lectureId: number;
  lectureTitle?: string;
  filePath?: string;
  originalFileName?: string;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description?: string;
  dueDate: string;
  lectureId: number;
  filePath?: string;
  originalFileName?: string;
  maxScore: number;
}

export interface UpdateAssignmentRequest {
  title: string;
  description?: string;
  dueDate: string;
  filePath?: string;
  originalFileName?: string;
  maxScore: number;
}

export interface SubmissionRequest {
  content?: string;
  filePath?: string;
  originalFileName?: string;
}

export interface SubmissionResponse {
  submissionId: number;
  assignmentId: number;
  assignmentTitle: string;
  studentNumber: string;
  studentName: string;
  content?: string;
  filePath?: string;
  originalFileName?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedByInstructorNumber?: number;
  gradedByInstructorName?: string;
}

export interface GradeRequest {
  score: number;
  feedback?: string;
}


