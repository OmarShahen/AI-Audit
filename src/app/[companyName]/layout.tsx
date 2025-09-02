"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AuditSidebar from "@/components/AuditSidebar";
import PageLoader from "@/components/ui/PageLoader";
import MobileHeader from "@/components/ui/MobileHeader";

interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  imageURL: string;
  formId: number;
  createdAt: string;
}

interface QuestionCategory {
  id: number;
  formId: number;
  name: string;
  order: number;
  createdAt: string;
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const companyName = params.companyName as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentSection, setCurrentSection] = useState(() => {
    const sectionParam = searchParams.get("section");
    return sectionParam ? parseInt(sectionParam, 10) || 1 : 1;
  });

  // Fetch company data and categories
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);

        // Fetch company by name
        const companyResponse = await fetch(
          `/api/companies/names/${encodeURIComponent(companyName)}`
        );
        if (!companyResponse.ok) {
          throw new Error("Company not found");
        }
        const companyData = await companyResponse.json();
        setCompany(companyData.company);

        // Fetch question categories for this company's form
        const categoriesResponse = await fetch(
          `/api/question-categories?formId=${companyData.company.formId}&limit=25&sortBy=order&sortOrder=asc`
        );
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch question categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data.questionCategories || []);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load company data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyName) {
      fetchCompanyData();
    }
  }, [companyName]);

  // Update current section based on URL changes
  useEffect(() => {
    const sectionParam = searchParams.get("section");
    const urlSection = sectionParam ? parseInt(sectionParam, 10) || 1 : 1;

    if (categories.length > 0) {
      const maxSection = categories.length;
      if (urlSection > maxSection || urlSection < 1) {
        setCurrentSection(1);
      } else {
        setCurrentSection(urlSection);
      }
    } else {
      setCurrentSection(urlSection);
    }
  }, [searchParams, categories]);

  // Function to handle section click
  const handleSectionClick = (sectionId: number) => {
    if (sectionId <= currentSection) {
      const url = new URL(window.location.href);
      url.searchParams.set("section", sectionId.toString());
      window.history.pushState({}, "", url.toString());
      setCurrentSection(sectionId);
    }
  };

  // Create sections based on categories
  const FORM_SECTIONS =
    categories.length > 0
      ? categories
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((cat, index) => ({
            id: index + 1,
            title: cat.name,
            categoryId: cat.id,
          }))
      : [];

  // Show loading state while fetching company data
  if (loading) {
    return (
      <PageLoader
        message="Loading company data"
        subtitle="Please wait while we fetch your information..."
      />
    );
  }

  // Show error state
  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Company Not Found
          </h1>
          <p className="text-slate-600 mb-4">
            {error || `The company "${companyName}" could not be found.`}
          </p>
          <p className="text-slate-500 text-sm">
            Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar - Hidden on mobile, slide-in when opened */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <AuditSidebar
            sections={FORM_SECTIONS}
            currentSection={currentSection}
            onSectionClick={handleSectionClick}
            companyName={company.name}
            companyLogo={company.imageURL}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile Header */}
          <MobileHeader
            companyName={company.name}
            currentSection={currentSection}
            totalSections={FORM_SECTIONS.length}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Content Area */}
          {children}
        </div>
      </div>
    </div>
  );
}
