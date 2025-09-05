"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import TextAreaField from "@/components/form/TextAreaField";
import RadioGroupField from "@/components/form/RadioGroupField";
import FormLoader from "@/components/ui/FormLoader";
import FormNavigation from "@/components/ui/FormNavigation";
import FormHeader from "@/components/ui/FormHeader";
import EmptySection from "@/components/ui/EmptySection";
import { useCompanyStore } from "@/store/company";
import { Question, FormData, FormSection } from "@/types";
import { apiClient } from "@/lib/api";
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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          params: { categoryId: currentSectionData.categoryId },
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
      router.push(`/send-report/${companyName}?submissionId=${submission.id}`);
    } catch (error) {
      console.error(error);
      toast.error("There was a problem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
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
    return (
      <div className="space-y-8">
        {questions.map((question) => renderQuestion(question))}
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
