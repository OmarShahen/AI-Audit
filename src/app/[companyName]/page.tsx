"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import TextAreaField from "@/components/form/TextAreaField";
import RadioGroupField from "@/components/form/RadioGroupField";
import FormLoader from "@/components/ui/FormLoader";
import FormNavigation from "@/components/ui/FormNavigation";
import FormHeader from "@/components/ui/FormHeader";
import EmptySection from "@/components/ui/EmptySection";
import { Company, QuestionCategory, Question, FormData, FormSection } from "@/types";


export default function CompanyAuditForm() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyName = params.companyName as string;

  const [questions, setQuestions] = useState<{
    [categoryId: number]: Question[];
  }>({});
  
  const [currentSection, setCurrentSection] = useState(() => {
    const sectionParam = searchParams.get('section');
    return sectionParam ? parseInt(sectionParam, 10) || 1 : 1;
  });
  const [formData, setFormData] = useState<FormData>({});
  
  // Temporary states for company data - will be optimized with context later
  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch company data and categories (simplified)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await axios.get(`/api/companies/names/${encodeURIComponent(companyName)}`);
        setCompany(companyResponse.data.company);

        const categoriesResponse = await axios.get(
          `/api/question-categories?formId=${companyResponse.data.company.formId}&limit=100&sortBy=order&sortOrder=asc`
        );
        setCategories(categoriesResponse.data.data.questionCategories || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyName]);

  // Add error state for questions
  const [questionErrors, setQuestionErrors] = useState<{
    [categoryId: number]: string;
  }>({});

  // Fetch questions for a specific category with embedded options and conditionals
  const fetchQuestionsForCategory = async (categoryId: number) => {
    if (questions[categoryId]) return questions[categoryId];

    try {
      // Clear any previous error for this category
      setQuestionErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[categoryId];
        return newErrors;
      });

      const response = await axios.get(
        `/api/questions?categoryId=${categoryId}&sortBy=order&sortOrder=asc&limit=100`
      );
      const categoryQuestions = response.data.data?.questions || [];

      setQuestions((prev) => ({ ...prev, [categoryId]: categoryQuestions }));
      return categoryQuestions;
    } catch (error) {
      console.error("Error fetching questions:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load questions';
      setQuestionErrors((prev) => ({ ...prev, [categoryId]: errorMessage }));
      return [];
    }
  };

  // Fetch questions based on current section from URL
  const fetchQuestionsForCurrentSection = async () => {
    const sectionParam = searchParams.get('section');
    const section = sectionParam ? parseInt(sectionParam, 10) || 1 : 1;
    
    const currentSectionData = FORM_SECTIONS.find(s => s.id === section);
    if (currentSectionData?.categoryId && !questions[currentSectionData.categoryId]) {
      await fetchQuestionsForCategory(currentSectionData.categoryId);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Check if a question should be shown based on conditionals
  const shouldShowQuestion = (question: Question) => {
    if (!question.conditionals || question.conditionals.length === 0) {
      return true; // No conditionals, always show
    }

    // Check all conditionals - question is shown if any conditional is met
    return question.conditionals.some((conditional) => {
      const conditionFieldKey = `question_${conditional.conditionQuestionId}`;
      const conditionValue = formData[conditionFieldKey];
      
      // Handle different value types
      if (Array.isArray(conditionValue)) {
        return conditionValue.includes(conditional.conditionValue) === conditional.showQuestion;
      } else {
        return (conditionValue === conditional.conditionValue) === conditional.showQuestion;
      }
    });
  };

  // Function to update URL with current section
  const updateUrlSection = (section: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('section', section.toString());
    window.history.replaceState({}, '', url.toString());
  };

  // Create sections based on categories
  const FORM_SECTIONS: FormSection[] =
    categories.length > 0
      ? categories
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((cat, index) => ({
            id: index + 1,
            title: cat.name,
            categoryId: cat.id,
          }))
      : [];

  // Fetch questions for current section based on URL parameter
  useEffect(() => {
    if (categories.length > 0) {
      fetchQuestionsForCurrentSection();
    }
  }, [searchParams, categories]);

  // Update current section when URL changes
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    const urlSection = sectionParam ? parseInt(sectionParam, 10) || 1 : 1;
    setCurrentSection(urlSection);
  }, [searchParams]);

  // Validate current section before moving to next
  const validateCurrentSection = () => {
    const currentSectionData = FORM_SECTIONS.find(s => s.id === currentSection);
    if (!currentSectionData?.categoryId) return true;

    const categoryQuestions = questions[currentSectionData.categoryId] || [];
    // Only validate visible questions that are required
    const visibleRequiredQuestions = categoryQuestions
      .filter((q) => q.required && shouldShowQuestion(q));

    for (const question of visibleRequiredQuestions) {
      const fieldKey = `question_${question.id}`;
      const value = formData[fieldKey];

      if (
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentSection()) {
      alert("Please answer all required questions before continuing.");
      return;
    }

    if (currentSection < FORM_SECTIONS.length) {
      const nextSection = currentSection + 1;
      updateUrlSection(nextSection);
      window.location.reload(); // Simple approach for now
    } else {
      // Form completed, store data and redirect to email page
      sessionStorage.setItem('formData', JSON.stringify(formData));
      router.push(`/${companyName}/email`);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      const prevSection = currentSection - 1;
      updateUrlSection(prevSection);
      window.location.reload(); // Simple approach for now
    }
  };

  // Render a single question based on its type
  const renderQuestion = (question: Question) => {
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
            />
          </div>
        );

      case "checkbox":
        const checkboxOptions = question.options || [];
        const selectedValues = Array.isArray(value) ? value : [];

        return (
          <div key={question.id} className="space-y-3">
            <label className="block text-slate-700 font-medium text-sm mb-3">
              {question.text}
              {question.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <div className="space-y-3">
              {checkboxOptions.map((option, index) => (
                <label
                  key={`${question.id}-${option.value}-${index}`}
                  className="flex items-start cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v) => v !== option.value);
                      handleInputChange(fieldKey, newValues);
                    }}
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-slate-700 leading-relaxed">
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
            {selectedValues.length > 0 && (
              <div className="text-xs text-slate-500 mt-2">
                {selectedValues.length} item
                {selectedValues.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        );

      case "conditional":
        // Check if this conditional question has options
        const conditionalOptions = question.options || [];
        
        if (conditionalOptions.length > 0) {
          // Render as multiple choice with conditional info
          return (
            <div key={question.id} className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium text-sm">
                      Conditional Question
                    </p>
                    <p className="text-blue-700 text-xs mt-1">
                      Your answer may reveal additional follow-up questions
                    </p>
                  </div>
                </div>
              </div>
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
              />
            </div>
          );
        } else {
          // Render as text area with conditional info
          return (
            <div key={question.id} className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium text-sm">
                      Conditional Question
                    </p>
                    <p className="text-blue-700 text-xs mt-1">
                      Your answer may reveal additional follow-up questions
                    </p>
                  </div>
                </div>
              </div>
              <TextAreaField
                label={question.text}
                value={value as string}
                onChange={(newValue) => handleInputChange(fieldKey, newValue)}
                required={question.required}
                rows={4}
                placeholder="Please provide details..."
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
    const currentSectionData = FORM_SECTIONS.find(s => s.id === currentSection);

    if (!currentSectionData?.categoryId) {
      return (
        <EmptySection
          title={currentSectionData?.title}
          message="Content coming soon..."
          icon="document"
        />
      );
    }

    const categoryQuestions = questions[currentSectionData.categoryId] || [];
    const hasError = questionErrors[currentSectionData.categoryId];

    // Show error state if there's an error loading questions
    if (hasError) {
      return (
        <EmptySection
          title="Failed to Load Questions"
          message={`Unable to load questions for this section. ${hasError}`}
          icon="error"
          variant="error"
          actionButton={{
            text: "Retry Loading",
            onClick: () => {
              // Clear error and retry fetching
              setQuestionErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[currentSectionData.categoryId];
                return newErrors;
              });
              fetchQuestionsForCategory(currentSectionData.categoryId);
            }
          }}
        />
      );
    }

    // Show loading state if no questions and no error
    if (!categoryQuestions.length && currentSectionData?.categoryId && !hasError) {
      return <FormLoader questionCount={3} />;
    }

    // Show empty state if no questions after loading
    if (!categoryQuestions.length && !hasError) {
      return (
        <EmptySection
          title={currentSectionData.title}
          message="No questions available for this section."
          icon="empty"
          variant="default"
        />
      );
    }

    // Filter questions based on conditionals and sort by order
    const visibleQuestions = categoryQuestions
      .filter((question) => shouldShowQuestion(question))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <div className="space-y-8">
        {visibleQuestions.map((question) => renderQuestion(question))}
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
            currentSectionTitle={FORM_SECTIONS.find((s) => s.id === currentSection)?.title || ""}
          />

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
          />
        </div>
      </div>
    </div>
  );
}