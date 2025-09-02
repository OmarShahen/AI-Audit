'use client';

import { useState } from 'react';

interface EmailCapturePageProps {
  onEmailSubmit: (email: string) => void;
  companyName?: string;
  companyLogo?: string;
}

export default function EmailCapturePage({ onEmailSubmit, companyName, companyLogo }: EmailCapturePageProps) {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setIsValidEmail(false);
      return;
    }

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    setIsSubmitting(true);
    setIsValidEmail(true);

    // Simulate a brief loading state
    setTimeout(() => {
      onEmailSubmit(email.trim());
      setIsSubmitting(false);
    }, 500);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Reset validation state when user starts typing
    if (!isValidEmail && newEmail.trim()) {
      setIsValidEmail(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          {companyLogo ? (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 shadow-lg border border-slate-200">
              <img 
                src={companyLogo} 
                alt={`${companyName} logo`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/48/48?text=' + encodeURIComponent((companyName || 'C').charAt(0));
                }}
              />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          {companyName ? (
            <>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {companyName}
              </h1>
              <h2 className="text-xl font-semibold text-slate-600 mb-4">
                AI & Automation Readiness Audit
              </h2>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Revi AI & Automation
              </h1>
              <h2 className="text-xl font-semibold text-slate-600 mb-4">
                Readiness Audit
              </h2>
            </>
          )}
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Get Your Custom Report
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Thank you for completing the assessment! Enter your email address to receive 
                your personalized AI & Automation readiness report with actionable recommendations.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Personalized Assessment</span> - Custom analysis based on your specific business needs
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Actionable Insights</span> - Specific recommendations with ROI estimates
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Quick & Easy</span> - Takes only 5-10 minutes to complete
                </p>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-slate-700 font-medium text-sm mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your business email"
                  className={`w-full p-4 border rounded-xl text-slate-700 placeholder-slate-400 transition-all duration-200 shadow-sm bg-white text-base
                    ${!isValidEmail 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400'
                    } focus:ring-2 focus:outline-none`}
                  disabled={isSubmitting}
                />
                {!isValidEmail && (
                  <p className="mt-2 text-sm text-red-600">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-base"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending Report...</span>
                  </div>
                ) : (
                  'Get My Assessment Report'
                )}
              </button>
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
              We respect your privacy. Your email will only be used to send your personalized report. 
              No spam, ever.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Trusted by businesses looking to scale with AI & Automation
          </p>
        </div>
      </div>
    </div>
  );
}