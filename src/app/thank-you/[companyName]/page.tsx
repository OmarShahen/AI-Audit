"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCompanyStore } from "@/store/company";
import PageLoader from "@/components/ui/PageLoader";

export default function ThankYouPage() {
  const params = useParams();
  const companyName = params.companyName as string;
  const [loading, setLoading] = useState(true);

  // Use Zustand store for company data
  const { company, fetchCompanyData } = useCompanyStore();

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        await fetchCompanyData(companyName);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyName) {
      loadCompanyData();
    }
  }, [companyName, fetchCompanyData]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          {company?.imageURL ? (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-lg border border-slate-200">
              <img
                src={company.imageURL}
                alt={`${company.name} logo`}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "/api/placeholder/64/64?text=" +
                    encodeURIComponent((company.name || "C").charAt(0));
                }}
              />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
          
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Thank You for Completing the Audit
          </h1>
          
          {company?.name && (
            <p className="text-xl text-slate-600 mb-6">
              {company.name} - AI & Automation Readiness Assessment
            </p>
          )}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="space-y-6 text-slate-700">
              <p className="text-lg lg:text-xl leading-relaxed">
                Your responses provide a clear picture of where your business stands today and where automation and AI can create the biggest impact. This is the first step toward reducing stress, saving time, and unlocking growth opportunities that may currently feel out of reach.
              </p>
              
              <p className="text-lg lg:text-xl leading-relaxed">
                Our team will now analyze your answers and prepare a personalized <strong className="text-slate-800">Technology & Workflow Opportunity Report</strong>. This report will highlight:
              </p>
              
              {/* Key Features List */}
              <div className="bg-slate-50 rounded-xl p-6 lg:p-8 border border-slate-200">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg leading-relaxed">Your business readiness score</span>
                  </li>
                  
                  <li className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg leading-relaxed">Key gaps and opportunities identified</span>
                  </li>
                  
                  <li className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg leading-relaxed">Practical next steps to help you achieve your goals</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-lg lg:text-xl leading-relaxed">
                You'll receive your report shortly. In the meantime, remember — <strong className="text-slate-800">every hour saved through automation is an hour that can be reinvested into growing your business and serving your customers better.</strong>
              </p>
            </div>
          </div>

          {/* Bottom Section with Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-slate-200 p-6 lg:p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Watch Your Inbox
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Your personalized Technology & Workflow Opportunity Report will be delivered to your email shortly.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Generated by {companyName} AI & Automation Readiness Audit System
          </p>
        </div>
      </div>
    </div>
  );
}