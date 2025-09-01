import { apiClient } from './index';
import type { 
  FormWithCategories, 
  CategoryWithQuestions,
  QuestionWithOptions,
  Submission,
  Answer,
  Report,
  APIResponse 
} from './types';

// Audit-specific API functions
export const auditAPI = {
  // Get the main audit form with all categories and questions
  async getAuditForm(formId: number = 1): Promise<FormWithCategories> {
    return apiClient.get<FormWithCategories>(`/api/forms/${formId}`);
  },

  // Get all question categories for a form
  async getQuestionCategories(formId: number = 1): Promise<CategoryWithQuestions[]> {
    return apiClient.get<CategoryWithQuestions[]>(`/api/question-categories?formId=${formId}`);
  },

  // Get a specific category with its questions
  async getCategoryWithQuestions(categoryId: number): Promise<CategoryWithQuestions> {
    return apiClient.get<CategoryWithQuestions>(`/api/question-categories/${categoryId}`);
  },

  // Get all questions for a specific category
  async getQuestionsByCategory(categoryId: number): Promise<QuestionWithOptions[]> {
    return apiClient.get<QuestionWithOptions[]>(`/api/questions?categoryId=${categoryId}`);
  },

  // Get a specific question with its options and conditionals
  async getQuestion(questionId: number): Promise<QuestionWithOptions> {
    return apiClient.get<QuestionWithOptions>(`/api/questions/${questionId}`);
  },

  // Create a new submission when user starts the audit
  async startSubmission(data: { 
    formId?: number;
    companyId?: number; 
  }): Promise<Submission> {
    return apiClient.post<Submission>('/api/submissions', data);
  },

  // Save answers for a submission (can be called multiple times as user progresses)
  async saveAnswers(submissionId: number, answers: Array<{
    questionId: number;
    value: string;
  }>): Promise<Answer[]> {
    return apiClient.post<Answer[]>('/api/answers', {
      submissionId,
      answers
    });
  },

  // Save a single answer
  async saveAnswer(data: {
    submissionId: number;
    questionId: number;
    value: string;
  }): Promise<Answer> {
    return apiClient.post<Answer>('/api/answers', data);
  },

  // Update an existing answer
  async updateAnswer(answerId: number, value: string): Promise<Answer> {
    return apiClient.put<Answer>(`/api/answers/${answerId}`, { value });
  },

  // Get all answers for a submission
  async getSubmissionAnswers(submissionId: number): Promise<Answer[]> {
    return apiClient.get<Answer[]>(`/api/answers?submissionId=${submissionId}`);
  },

  // Complete the submission and generate report
  async completeSubmission(submissionId: number): Promise<Report> {
    return apiClient.post<Report>('/api/reports', { submissionId });
  },

  // Get a specific report
  async getReport(reportId: number): Promise<Report> {
    return apiClient.get<Report>(`/api/reports/${reportId}`);
  },

  // Send email with report
  async sendReportEmail(data: {
    reportId: number;
    email: string;
    recipientName?: string;
  }): Promise<APIResponse<{ sent: boolean }>> {
    return apiClient.post<APIResponse<{ sent: boolean }>>('/api/send-email', data);
  },

  // Create or get company data
  async createCompany(data: {
    name: string;
    industry: string;
    size: string;
  }) {
    return apiClient.post('/api/companies', data);
  },

  async getCompany(companyId: number) {
    return apiClient.get(`/api/companies/${companyId}`);
  }
};