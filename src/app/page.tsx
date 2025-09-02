'use client';

import { useState } from 'react';

export default function HomePage() {
  const [companyName, setCompanyName] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleTryAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      // Redirect to the company's form
      window.location.href = `/${encodeURIComponent(companyName.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
              Revi AI & Automation
            </h1>
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-600 mb-6">
              Business Readiness Assessment
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 px-6 lg:px-8 py-6 lg:py-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">
                Company-Specific Assessments
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Our AI & Automation readiness assessments are tailored specifically for registered companies. 
                Each assessment is customized based on your industry, size, and business needs.
              </p>
            </div>
            
            <div className="p-6 lg:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Access Form */}
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-4">
                    Access Your Assessment
                  </h4>
                  <p className="text-slate-600 mb-6">
                    If your company is registered with us, enter your company name to access your personalized assessment.
                  </p>
                  
                  <form onSubmit={handleTryAccess} className="space-y-4">
                    <div>
                      <label htmlFor="companyName" className="block text-slate-700 font-medium text-sm mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter your registered company name"
                        className="w-full p-4 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 transition-all duration-200 shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!companyName.trim()}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Access Assessment
                    </button>
                  </form>
                  
                  <p className="text-xs text-slate-500 text-center mt-4">
                    Only registered companies can access their specific assessments
                  </p>
                </div>

                {/* Information Panel */}
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-4">
                    How It Works
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-800">Company Registration</h5>
                        <p className="text-slate-600 text-sm">Your company is pre-registered with a customized assessment form</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <span className="text-blue-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-800">Personalized Questions</h5>
                        <p className="text-slate-600 text-sm">Answer questions tailored to your industry and business size</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <span className="text-blue-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-800">Custom Report</h5>
                        <p className="text-slate-600 text-sm">Receive detailed insights and recommendations specific to your business</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="p-6 lg:p-8">
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-800 mb-4">
                  Need Assessment Access?
                </h4>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  If your company isn't registered yet or you need help accessing your assessment, 
                  our team is here to help you get started with your AI & Automation readiness journey.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Learn More
                  </button>
                  
                  <a
                    href="mailto:contact@revi.ai?subject=Assessment Access Request"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.82 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </a>
                </div>
              </div>
              
              {showInfo && (
                <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-800 mb-3">About Our Assessments</h5>
                  <div className="space-y-3 text-slate-600 text-sm">
                    <p>
                      <strong>Customized Experience:</strong> Each assessment is built specifically for your company's 
                      profile, ensuring relevant questions and actionable insights.
                    </p>
                    <p>
                      <strong>Industry-Specific:</strong> Questions are tailored based on your industry, company size, 
                      and current technology stack.
                    </p>
                    <p>
                      <strong>Comprehensive Analysis:</strong> Our assessment covers AI readiness, automation opportunities, 
                      data management, and implementation planning.
                    </p>
                    <p>
                      <strong>Expert Recommendations:</strong> Receive detailed recommendations with ROI estimates 
                      and implementation roadmaps.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-slate-500">
            <p className="text-sm">
              © 2024 Revi AI & Automation. Empowering businesses with intelligent automation solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}