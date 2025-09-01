import { useState, useEffect, useCallback } from 'react';
import { auditAPI } from '@/lib/api/audit';
import type { 
  FormWithCategories, 
  CategoryWithQuestions,
  Submission
} from '@/lib/api/types';

// Custom hook for managing audit session state
export function useAuditSession() {
  const [auditForm, setAuditForm] = useState<FormWithCategories | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the audit form structure
  const loadAuditForm = useCallback(async (formId: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const form = await auditAPI.getAuditForm(formId);
      setAuditForm(form);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load audit form');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start a new audit submission
  const startSubmission = useCallback(async (data?: { companyId?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const submission = await auditAPI.startSubmission({
        formId: auditForm?.id,
        ...data
      });
      setCurrentSubmission(submission);
      return submission;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start submission');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [auditForm]);

  // Save answer for a question
  const saveAnswer = useCallback(async (questionId: number, value: string) => {
    if (!currentSubmission) return;

    setError(null);
    try {
      await auditAPI.saveAnswer({
        submissionId: currentSubmission.id,
        questionId,
        value
      });
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save answer');
    }
  }, [currentSubmission]);

  // Navigate to next category
  const nextCategory = useCallback(() => {
    if (auditForm && currentCategoryIndex < auditForm.categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    }
  }, [auditForm, currentCategoryIndex]);

  // Navigate to previous category
  const previousCategory = useCallback(() => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  }, [currentCategoryIndex]);

  // Go to specific category
  const goToCategory = useCallback((categoryIndex: number) => {
    if (auditForm && categoryIndex >= 0 && categoryIndex < auditForm.categories.length) {
      setCurrentCategoryIndex(categoryIndex);
    }
  }, [auditForm]);

  // Complete the audit and generate report
  const completeAudit = useCallback(async () => {
    if (!currentSubmission) return null;

    setIsLoading(true);
    setError(null);
    try {
      const report = await auditAPI.completeSubmission(currentSubmission.id);
      return report;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to complete audit');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSubmission]);

  // Get current category
  const currentCategory = auditForm?.categories[currentCategoryIndex] || null;

  // Get progress percentage
  const progress = auditForm ? ((currentCategoryIndex + 1) / auditForm.categories.length) * 100 : 0;

  // Check if can go to next category (basic validation)
  const canGoNext = currentCategoryIndex < (auditForm?.categories.length || 0) - 1;
  const canGoPrevious = currentCategoryIndex > 0;

  return {
    // Data
    auditForm,
    currentSubmission,
    currentCategory,
    currentCategoryIndex,
    answers,
    progress,
    
    // State
    isLoading,
    error,
    canGoNext,
    canGoPrevious,
    
    // Actions
    loadAuditForm,
    startSubmission,
    saveAnswer,
    nextCategory,
    previousCategory,
    goToCategory,
    completeAudit,
    
    // Helpers
    clearError: () => setError(null)
  };
}

// Hook for loading question categories
export function useQuestionCategories(formId: number = 1) {
  const [categories, setCategories] = useState<CategoryWithQuestions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await auditAPI.getQuestionCategories(formId);
        setCategories(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [formId]);

  return { categories, isLoading, error };
}