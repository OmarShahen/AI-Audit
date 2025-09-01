// Types based on your existing database schema

export interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  createdAt: Date;
}

export interface Form {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
}

export interface QuestionCategory {
  id: number;
  formId: number;
  name: string;
  order: number;
  createdAt: Date;
}

export interface Question {
  id: number;
  categoryId: number;
  text: string;
  type: 'text' | 'multiple_choice' | 'checkbox' | 'conditional';
  required: boolean;
  order: number;
  createdAt: Date;
  options?: QuestionOption[];
  conditionals?: QuestionConditional[];
}

export interface QuestionOption {
  id: number;
  questionId: number;
  text: string;
  value: string;
  order: number;
  createdAt: Date;
}

export interface QuestionConditional {
  id: number;
  questionId: number;
  conditionQuestionId: number;
  conditionValue: string;
  showQuestion: boolean;
  createdAt: Date;
}

export interface Submission {
  id: number;
  formId?: number;
  companyId?: number;
  createdAt: Date;
}

export interface Answer {
  id: number;
  submissionId: number;
  questionId: number;
  value: string;
  createdAt: Date;
}

export interface Report {
  id: number;
  submissionId: number;
  title: string;
  content: string;
  generatedAt: Date;
  createdAt: Date;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Extended types for frontend usage
export interface QuestionWithOptions extends Question {
  options: QuestionOption[];
  conditionals: QuestionConditional[];
}

export interface CategoryWithQuestions extends QuestionCategory {
  questions: QuestionWithOptions[];
}

export interface FormWithCategories extends Form {
  categories: CategoryWithQuestions[];
}

// Audit session for frontend state
export interface AuditSession {
  email: string;
  currentCategoryId: number;
  formData: Record<string, any>;
  startedAt: Date;
}