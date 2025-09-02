"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import TextAreaField from "@/components/form/TextAreaField";
import RadioGroupField from "@/components/form/RadioGroupField";
import FormLoader, { QuestionOptionLoader } from "@/components/ui/FormLoader";
import { Company, QuestionCategory, Question, QuestionOption, FormData, FormSection } from "@/types";


export default function CompanyAuditForm() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyName = params.companyName as string;

  const [questions, setQuestions] = useState<{
    [categoryId: number]: Question[];
  }>({});
  const [questionOptions, setQuestionOptions] = useState<{
    [questionId: number]: QuestionOption[];
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

  // Fetch questions for a specific category
  const fetchQuestionsForCategory = async (categoryId: number) => {
    if (questions[categoryId]) return questions[categoryId];

    try {
      const response = await axios.get(
        `/api/questions?categoryId=${categoryId}&sortBy=order&sortOrder=asc&limit=100`
      );
      const categoryQuestions = response.data.data?.questions || [];

      setQuestions((prev) => ({ ...prev, [categoryId]: categoryQuestions }));

      // Fetch options for multiple choice and checkbox questions
      const questionsWithOptions = categoryQuestions.filter(
        (q: Question) => q.type === "multiple_choice" || q.type === "checkbox"
      );

      for (const question of questionsWithOptions) {
        if (!questionOptions[question.id]) {
          try {
            const optionsResponse = await axios.get(
              `/api/question-options?questionId=${question.id}&sortBy=order&sortOrder=asc&limit=100`
            );
            const options = optionsResponse.data.data?.questionOptions || [];
            setQuestionOptions((prev) => ({
              ...prev,
              [question.id]: options,
            }));
          } catch (optionError) {
            console.error(`Error fetching options for question ${question.id}:`, optionError);
          }
        }
      }

      return categoryQuestions;
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  // Fetch questions for current section
  useEffect(() => {
    if (categories.length > 0) {
      const currentSectionData = FORM_SECTIONS.find(s => s.id === currentSection);
      if (currentSectionData?.categoryId && !questions[currentSectionData.categoryId]) {
        fetchQuestionsForCategory(currentSectionData.categoryId);
      }
    }
  }, [currentSection, categories]);

  // Validate current section before moving to next
  const validateCurrentSection = () => {
    const currentSectionData = FORM_SECTIONS.find(s => s.id === currentSection);
    if (!currentSectionData?.categoryId) return true;

    const categoryQuestions = questions[currentSectionData.categoryId] || [];
    const requiredQuestions = categoryQuestions.filter((q) => q.required);

    for (const question of requiredQuestions) {
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
        const options = questionOptions[question.id] || [];

        if (options.length === 0) {
          return (
            <div key={question.id} className="space-y-3">
              <QuestionOptionLoader optionCount={3} />
            </div>
          );
        }

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
        const checkboxOptions = questionOptions[question.id] || [];
        const selectedValues = Array.isArray(value) ? value : [];

        if (checkboxOptions.length === 0) {
          return (
            <div key={question.id} className="space-y-3">
              <QuestionOptionLoader optionCount={3} />
            </div>
          );
        }

        return (
          <div key={question.id} className="space-y-3">
            <label className="block text-slate-700 font-medium text-sm mb-3">
              {question.text}
              {question.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <div className="space-y-3">
              {checkboxOptions.map((option) => (
                <label
                  key={option.id}
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
        <div className="text-center py-16 text-gray-500">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            {currentSectionData?.title}
          </h3>
          <p>Content coming soon...</p>
        </div>
      );
    }

    const categoryQuestions = questions[currentSectionData.categoryId] || [];

    if (!categoryQuestions.length && currentSectionData?.categoryId) {
      return <FormLoader questionCount={3} />;
    }

    return (
      <div className="space-y-8">
        {categoryQuestions
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((question) => renderQuestion(question))}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
          {/* Header - Desktop only */}
          <div className="hidden lg:block bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={company.imageURL}
                  alt={`${company.name} logo`}
                  className="h-12 w-12 rounded-lg object-contain bg-white p-1 border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/api/placeholder/48/48?text=" +
                      encodeURIComponent(company.name.charAt(0));
                  }}
                />
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-1">
                    Part {currentSection}:{" "}
                    {FORM_SECTIONS.find((s) => s.id === currentSection)?.title}
                  </h2>
                  <p className="text-slate-600 text-sm lg:text-base">
                    {company.name} • Section {currentSection} of{" "}
                    {FORM_SECTIONS.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/60 text-sm font-medium text-slate-600">
                  {Math.round(
                    ((currentSection - 1) / FORM_SECTIONS.length) * 100
                  )}
                  % Complete
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 px-4 py-4">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={company.imageURL}
                alt={`${company.name} logo`}
                className="h-8 w-8 rounded object-contain bg-white p-1 border border-slate-200"
                onError={(e) => {
                  e.currentTarget.src =
                    "/api/placeholder/32/32?text=" +
                    encodeURIComponent(company.name.charAt(0));
                }}
              />
              <h2 className="text-lg font-bold text-slate-800">
                {FORM_SECTIONS.find((s) => s.id === currentSection)?.title}
              </h2>
            </div>
            <p className="text-slate-600 text-sm">
              {company.name} • Section {currentSection} of{" "}
              {FORM_SECTIONS.length}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-4 lg:p-8">{renderCurrentSection()}</div>

          {/* Navigation */}
          <div className="bg-slate-50/50 border-t border-slate-200/60 px-4 lg:px-8 py-4 lg:py-6">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentSection === 1}
                className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm text-sm lg:text-base"
              >
                <svg
                  className="w-4 h-4 mr-1 lg:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>

              <div className="flex items-center space-x-1 lg:space-x-2">
                {FORM_SECTIONS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all duration-300 ${
                      index < currentSection - 1
                        ? "bg-emerald-500"
                        : index === currentSection - 1
                        ? "bg-blue-500"
                        : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base"
              >
                <span className="hidden sm:inline">
                  {currentSection === FORM_SECTIONS.length
                    ? "Complete Assessment"
                    : "Next"}
                </span>
                <span className="sm:hidden">
                  {currentSection === FORM_SECTIONS.length ? "✓" : "→"}
                </span>
                <svg
                  className="w-4 h-4 ml-1 lg:ml-2 hidden sm:inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}