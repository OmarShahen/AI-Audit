"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import TextAreaField from "@/components/form/TextAreaField";
import RadioGroupField from "@/components/form/RadioGroupField";
import CheckboxGroupField from "@/components/form/CheckboxGroupField";
import FormLoader from "@/components/ui/FormLoader";
import FormNavigation from "@/components/ui/FormNavigation";
import FormHeader from "@/components/ui/FormHeader";
import EmptySection from "@/components/ui/EmptySection";
import ConditionalQuestionHint from "@/components/ui/ConditionalQuestionHint";
import { useCompanyStore } from "@/store/company";
import { Question, FormData, FormSection } from "@/types";
import toast from "react-hot-toast";

export default function CompanyAuditForm() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyName = params.companyName as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [isQuestionsError, setIsQuestionsError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use Zustand store for company data
  const { company, categories, loading, fetchCompanyData } = useCompanyStore();

  // Fetch company data using Zustand store
  useEffect(() => {
    fetchCompanyData(companyName);
  }, [companyName, fetchCompanyData]);

  // Restore form data from localStorage on component mount
  useEffect(() => {
    const storageKey = `formData_${companyName}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        // Clear corrupted data
        localStorage.removeItem(storageKey);
      }
    }
  }, [companyName]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to clear saved form data
  const clearSavedData = () => {
    const storageKey = `formData_${companyName}`;
    localStorage.removeItem(storageKey);
  };

  // Check if a question is a parent question (has no conditionals or is referenced by other questions)
  const isParentQuestion = (question: Question): boolean => {
    return !question.conditionals || question.conditionals.length === 0;
  };

  // Function to check if a question should be shown based on conditionals
  const shouldShowQuestion = (question: Question): boolean => {
    // Always show parent questions (questions without conditionals)
    if (isParentQuestion(question)) {
      return true;
    }

    // For conditional questions, check if their conditions are met
    return question.conditionals.every((conditional) => {
      const conditionFieldKey = `question_${conditional.conditionQuestionId}`;
      const currentAnswer = formData[conditionFieldKey];

      // If no answer is provided yet, hide the conditional question
      if (!currentAnswer) {
        return false;
      }

      const answerArray = Array.isArray(currentAnswer)
        ? currentAnswer
        : [currentAnswer];
      const conditionValues = conditional.conditionValues || [];

      // Check if any of the current answers match the condition values
      const hasMatch = conditionValues.some((conditionValue) =>
        answerArray.includes(conditionValue)
      );

      if (conditional.operator === "AND") {
        // For AND operator, all condition values must match
        const allMatch = conditionValues.every((conditionValue) =>
          answerArray.includes(conditionValue)
        );
        return conditional.showQuestion ? allMatch : !allMatch;
      } else {
        // For OR operator (default), at least one condition value must match
        return conditional.showQuestion ? hasMatch : !hasMatch;
      }
    });
  };

  // Function to get hint text for hidden conditional questions
  const getConditionalHint = (question: Question): string | null => {
    if (isParentQuestion(question)) return null;

    const conditional = question.conditionals[0]; // Get first conditional for hint
    if (!conditional) return null;

    const conditionQuestion = questions.find(
      (q) => q.id === conditional.conditionQuestionId
    );
    if (!conditionQuestion) return null;

    const triggerOptions = conditional.conditionValues
      .map((value) => {
        const option = conditionQuestion.options?.find(
          (opt) => opt.value === value
        );
        return option?.text || value;
      })
      .join(" or ");

    return `This question will appear if you select "${triggerOptions}" above.`;
  };

  // Function to update URL with current section
  const updateUrlSection = (section: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("section", section.toString());
    window.history.replaceState({}, "", url.toString());
  };

  // Create sections based on categories
  const FORM_SECTIONS: FormSection[] = useMemo(
    () =>
      categories.length > 0
        ? categories
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((cat, index) => ({
              id: index + 1,
              title: cat.name,
              categoryId: cat.id,
            }))
        : [],
    [categories]
  );

  // Initialize current section from URL parameter
  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam && FORM_SECTIONS.length > 0) {
      const sectionNumber = parseInt(sectionParam, 10);
      if (sectionNumber >= 1 && sectionNumber <= FORM_SECTIONS.length) {
        setCurrentSection(sectionNumber);
      }
    }
  }, [FORM_SECTIONS, searchParams]);

  // Fetch questions for current section
  useEffect(() => {
    const fetchQuestions = async () => {
      if (FORM_SECTIONS.length === 0) return;

      try {
        setIsQuestionsLoading(true);
        setIsQuestionsError(false);

        const currentSectionData = FORM_SECTIONS.find(
          (s) => s.id === currentSection
        );
        if (!currentSectionData) return;

        const response = await axios.get("/api/questions", {
          params: {
            categoryId: currentSectionData.categoryId,
            sortOrder: "asc",
          },
        });
        const { questions } = response.data.data;
        setQuestions(questions);
      } catch (error) {
        console.error(error);
        setIsQuestionsError(true);
      } finally {
        setIsQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [currentSection, FORM_SECTIONS]);

  const submitSurvey = async () => {
    try {
      setIsSubmitting(true);
      const payloadData = {
        companyName,
        formData,
      };

      const response = await axios.post(
        `/api/submissions/complete`,
        payloadData
      );

      const { submission } = response.data.data;
      clearSavedData()
      router.push(`/send-report/${companyName}?submissionId=${submission.id}`);
    } catch (error) {
      console.error(error);
      toast.error("There was a problem");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to validate current section
  const validateCurrentSection = (): { isValid: boolean; missingFields: string[] } => {
    const sortedQuestions = questions.sort((a, b) => (a.order || 0) - (b.order || 0));
    const visibleQuestions = sortedQuestions.filter(shouldShowQuestion);
    const missingFields: string[] = [];

    for (const question of visibleQuestions) {
      if (question.required) {
        const fieldKey = `question_${question.id}`;
        const value = formData[fieldKey];
        
        if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(question.text);
        }
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  const handleNext = async () => {
    // Validate current section before proceeding
    const validation = validateCurrentSection();
    
    if (!validation.isValid) {
      const count = validation.missingFields.length;
      const message = count === 1 
        ? "Please complete the required field to continue"
        : `Please complete all ${count} required fields to continue`;
      toast.error(message);
      return;
    }

    // Save form data to localStorage before moving to next section or submitting
    const storageKey = `formData_${companyName}`;
    localStorage.setItem(storageKey, JSON.stringify(formData));

    if (currentSection < FORM_SECTIONS.length) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      updateUrlSection(nextSection);
    } else {
      await submitSurvey();
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      updateUrlSection(prevSection);
    }
  };

  // Render a single question based on its type
  const renderQuestion = (question: Question, questionNumber?: number) => {
    const fieldKey = `question_${question.id}`;
    const value = formData[fieldKey] || "";

    switch (question.type) {
      case "text":
        return (
          <div key={question.id} className="space-y-3">
            <TextAreaField
              label={question.text}
              value={value as string}
              onChange={(newValue) => handleInputChange(fieldKey, newValue)}
              required={question.required}
              rows={4}
              placeholder="Enter your response here..."
              questionNumber={questionNumber}
            />
          </div>
        );

      case "multiple_choice":
        const options = question.options || [];

        return (
          <div key={question.id} className="space-y-3">
            <RadioGroupField
              label={question.text}
              value={value as string}
              onChange={(newValue) => handleInputChange(fieldKey, newValue)}
              options={options.map((opt) => ({
                value: opt.value,
                label: opt.text,
              }))}
              name={fieldKey}
              required={question.required}
              questionNumber={questionNumber}
            />
          </div>
        );

      case "checkbox":
        const checkboxOptions = question.options || [];

        return (
          <div key={question.id} className="space-y-3">
            <CheckboxGroupField
              label={question.text}
              value={Array.isArray(value) ? value : []}
              onChange={(newValue) => handleInputChange(fieldKey, newValue)}
              options={checkboxOptions}
              required={question.required}
              questionNumber={questionNumber}
            />
          </div>
        );

      case "conditional":
        // Check if this conditional question has options
        const conditionalOptions = question.options || [];

        if (conditionalOptions.length > 0) {
          // Render as multiple choice with conditional info
          return (
            <div key={question.id} className="space-y-3">
              <RadioGroupField
                label={question.text}
                value={value as string}
                onChange={(newValue) => handleInputChange(fieldKey, newValue)}
                options={conditionalOptions.map((opt) => ({
                  value: opt.value,
                  label: opt.text,
                }))}
                name={fieldKey}
                required={question.required}
                questionNumber={questionNumber}
              />
            </div>
          );
        } else {
          // Render as text area with conditional info
          return (
            <div key={question.id} className="space-y-3">
              <TextAreaField
                label={question.text}
                value={value as string}
                onChange={(newValue) => handleInputChange(fieldKey, newValue)}
                required={question.required}
                rows={4}
                placeholder="Please provide details..."
                questionNumber={questionNumber}
              />
            </div>
          );
        }

      default:
        return (
          <div key={question.id} className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                ⚠️ Unknown question type: {question.type}
              </p>
            </div>
            <TextAreaField
              label={question.text}
              value={value as string}
              onChange={(newValue) => handleInputChange(fieldKey, newValue)}
              required={question.required}
              rows={3}
              placeholder="Enter your response..."
              questionNumber={questionNumber}
            />
          </div>
        );
    }
  };

  if (loading || !company) {
    return (
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <FormLoader questionCount={3} />
        </div>
      </div>
    );
  }

  // Render current section with dynamic questions
  const renderCurrentSection = () => {
    // Show error state if there's an error loading questions
    if (isQuestionsError) {
      return (
        <EmptySection
          title="Failed to Load Questions"
          message={`Unable to load questions for this section.`}
          icon="error"
          variant="error"
          actionButton={{
            text: "Retry Loading",
            onClick: () => {},
          }}
        />
      );
    }
    // Get all questions sorted by order
    const sortedQuestions = questions.sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    let visibleQuestionNumber = 1;

    return (
      <div className="space-y-8">
        {sortedQuestions.map((question) => {
          const isVisible = shouldShowQuestion(question);
          const hint = getConditionalHint(question);

          if (isVisible) {
            const questionElement = renderQuestion(question, visibleQuestionNumber);
            visibleQuestionNumber++;
            return questionElement;
          } else if (hint) {
            // Show hint for hidden conditional questions
            return (
              <ConditionalQuestionHint
                key={`hint-${question.id}`}
                hint={hint}
                isRequired={question.required}
              />
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
          {/* Form Header */}
          <FormHeader
            companyName={company.name}
            companyLogo={company.imageURL}
            currentSection={currentSection}
            totalSections={FORM_SECTIONS.length}
            currentSectionTitle={
              FORM_SECTIONS.find((s) => s.id === currentSection)?.title || ""
            }
          />

          {isQuestionsLoading ? (
            <FormLoader questionCount={3} />
          ) : (
            <>
              {/* Form Content */}
              <div className="p-4 lg:p-8">{renderCurrentSection()}</div>

              {/* Navigation */}
              <FormNavigation
                currentSection={currentSection}
                totalSections={FORM_SECTIONS.length}
                onBack={handleBack}
                onNext={handleNext}
                isFirstSection={currentSection === 1}
                isLastSection={currentSection === FORM_SECTIONS.length}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
