"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import EmailCapturePage from "@/components/EmailCapturePage";
import PageLoader from "@/components/ui/PageLoader";
import { useCompanyStore } from "@/store/company";
import toast from "react-hot-toast";
import axios from "axios";

export default function CompanyEmailCapture() {
  const params = useParams();
  const router = useRouter();
  const companyName = params.companyName as string;

  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use Zustand store for company data
  const { company, fetchCompanyData } = useCompanyStore();

  // Check for form data and fetch company data
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        await fetchCompanyData(companyName);
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
      loadCompanyData();
    }
  }, [companyName, router, fetchCompanyData]);

  const handleEmailSubmit = async (email: string) => {
    try {
      const payloadData = {
        email,
        submissionId: Number.parseInt(
          searchParams.get("submissionId") as string,
          10
        ),
      };

      const response = await axios.post(`/api/reports/generate`, payloadData);

      setSuccessMessage(response.data.message || "Report sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        "There was an error submitting your assessment. Please try again."
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <PageLoader
        message="Loading company data"
        subtitle="Please wait while we fetch your information..."
      />
    );
  }

  // Error state
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
      {/* Back Button
      <div className="p-4">
        <button
          onClick={handleBackToForm}
          className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-50 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Form
        </button>
      </div> */}

      <EmailCapturePage
        onEmailSubmit={handleEmailSubmit}
        companyName={company.name}
        companyLogo={company.imageURL}
        successMessage={successMessage}
      />
    </div>
  );
}
