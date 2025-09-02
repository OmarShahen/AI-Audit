// Company related interfaces
export interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  imageURL: string;
  formId: number;
  createdAt: string;
}

// Question category interface
export interface QuestionCategory {
  id: number;
  formId: number;
  name: string;
  order: number;
  createdAt: string;
}

// Question interface
export interface Question {
  id: number;
  categoryId: number;
  text: string;
  type: "text" | "multiple_choice" | "checkbox" | "conditional";
  required: boolean;
  order: number;
  createdAt: string;
}

// Question option interface
export interface QuestionOption {
  id: number;
  questionId: number;
  text: string;
  value: string;
  order: number;
  createdAt: string;
}

// Form section interface (used in sidebar)
export interface FormSection {
  id: number;
  title: string;
  categoryId: number;
}

// Form data interface for storing user responses
export interface FormData {
  [key: string]: string | string[]; // Dynamic form data
}

// API response interfaces
export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
}

export interface CompanyApiResponse {
  company: Company;
}

export interface QuestionCategoriesApiResponse {
  questionCategories: QuestionCategory[];
}

export interface QuestionsApiResponse {
  questions: Question[];
}

export interface QuestionOptionsApiResponse {
  questionOptions: QuestionOption[];
}