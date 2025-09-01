'use client';

import { useState } from 'react';
import AuditSidebar from '@/components/AuditSidebar';
import EmailCapturePage from '@/components/EmailCapturePage';
import TextAreaField from '@/components/form/TextAreaField';
import RadioGroupField from '@/components/form/RadioGroupField';
import ConditionalTextArea from '@/components/form/ConditionalTextArea';

interface FormData {
  email: string;
  coreBusinessActivities: string;
  operationalChallenges: string;
  businessGoals: string;
  processDocumentation: 'fully_documented' | 'partially_documented' | 'not_documented' | '';
  processStandardization: 'highly_standardized' | 'somewhat_standardized' | 'mostly_individualized' | '';
  approvalsManagement: 'automated_workflows' | 'email_chat' | 'verbal_in_person' | '';
  handoffIssues: 'frequently' | 'occasionally' | 'rarely_never' | '';
  handoffDescription: string;
}

const FORM_SECTIONS = [
  { id: 1, title: 'Business Overview & Primary Challenges' },
  { id: 2, title: 'Technology & Data Infrastructure' },
  { id: 3, title: 'Process & Workflow Maturity' },
  { id: 4, title: 'Team & Skills Assessment' },
  { id: 5, title: 'Customer Experience & Touchpoints' },
  { id: 6, title: 'Compliance & Risk Management' },
  { id: 7, title: 'Budget & Resource Planning' },
  { id: 8, title: 'Implementation Readiness' },
];

export default function AuditForm() {
  const [showEmailCapture, setShowEmailCapture] = useState(true);
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    coreBusinessActivities: '',
    operationalChallenges: '',
    businessGoals: '',
    processDocumentation: '',
    processStandardization: '',
    approvalsManagement: '',
    handoffIssues: '',
    handoffDescription: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentSection < FORM_SECTIONS.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionClick = (sectionId: number) => {
    if (sectionId < currentSection) {
      setCurrentSection(sectionId);
    }
  };

  const handleEmailSubmit = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    setShowEmailCapture(false);
  };

  const renderSection1 = () => (
    <div className="space-y-8">
      <TextAreaField
        label="Briefly describe your core business activities."
        value={formData.coreBusinessActivities}
        onChange={(value) => handleInputChange('coreBusinessActivities', value)}
        placeholder="Answer"
        maxLength={200}
        showCharacterCount={true}
        rows={4}
        required={true}
      />

      <TextAreaField
        label="List your top three most significant operational or workflow challenges."
        value={formData.operationalChallenges}
        onChange={(value) => handleInputChange('operationalChallenges', value)}
        rows={4}
      />

      <TextAreaField
        label="What are your top 2–3 business goals for the next 12 months?"
        value={formData.businessGoals}
        onChange={(value) => handleInputChange('businessGoals', value)}
        rows={4}
      />
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-8">
      <RadioGroupField
        label="Are your key business processes formally documented?"
        value={formData.processDocumentation}
        onChange={(value) => handleInputChange('processDocumentation', value as FormData['processDocumentation'])}
        options={[
          { value: 'fully_documented', label: 'Fully documented and accessible' },
          { value: 'partially_documented', label: 'Partially documented' },
          { value: 'not_documented', label: 'Not documented' },
        ]}
        name="processDocumentation"
        required={true}
      />

      <RadioGroupField
        label="Are processes typically standardized across the organization?"
        value={formData.processStandardization}
        onChange={(value) => handleInputChange('processStandardization', value as FormData['processStandardization'])}
        options={[
          { value: 'highly_standardized', label: 'Highly standardized' },
          { value: 'somewhat_standardized', label: 'Somewhat standardized' },
          { value: 'mostly_individualized', label: 'Mostly individualized' },
        ]}
        name="processStandardization"
        description="Maybe"
      />

      <RadioGroupField
        label="How are approvals and sign-offs typically managed?"
        value={formData.approvalsManagement}
        onChange={(value) => handleInputChange('approvalsManagement', value as FormData['approvalsManagement'])}
        options={[
          { value: 'automated_workflows', label: 'Automated workflows' },
          { value: 'email_chat', label: 'Via email or chat (manual)' },
          { value: 'verbal_in_person', label: 'Verbally or in-person (manual)' },
        ]}
        name="approvalsManagement"
      />

      <div>
        <RadioGroupField
          label="Do you experience delays, errors, or confusion in handoffs between departments or team members?"
          value={formData.handoffIssues}
          onChange={(value) => handleInputChange('handoffIssues', value as FormData['handoffIssues']))
          options={[
            { value: 'frequently', label: 'Frequently' },
            { value: 'occasionally', label: 'Occasionally' },
            { value: 'rarely_never', label: 'Rarely or never' },
          ]}
          name="handoffIssues"
          description="If frequently or occasionally, please describe where these issues happen."
        />
        
        <ConditionalTextArea
          condition={formData.handoffIssues === 'frequently' || formData.handoffIssues === 'occasionally'}
          label="Please describe where these issues happen:"
          value={formData.handoffDescription}
          onChange={(value) => handleInputChange('handoffDescription', value)}
          placeholder="Please describe where these issues happen."
        />
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return renderSection1();
      case 3:
        return renderSection3();
      default:
        return (
          <div className="text-center py-16 text-gray-500">
            Section {currentSection} content coming soon...
          </div>
        );
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show email capture page first
  if (showEmailCapture) {
    return <EmailCapturePage onEmailSubmit={handleEmailSubmit} />;
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
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <AuditSidebar 
            sections={FORM_SECTIONS}
            currentSection={currentSection}
            onSectionClick={handleSectionClick}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-slate-200/60 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-800">Part {currentSection}</div>
                <div className="text-xs text-slate-500">{currentSection}/{FORM_SECTIONS.length}</div>
              </div>
              <div className="px-2 py-1 bg-blue-50 rounded-md text-xs font-medium text-blue-600">
                {Math.round(((currentSection - 1) / FORM_SECTIONS.length) * 100)}%
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                {/* Header - Desktop only */}
                <div className="hidden lg:block bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 px-6 lg:px-8 py-4 lg:py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-1">
                        Part {currentSection}: {FORM_SECTIONS.find(s => s.id === currentSection)?.title}
                      </h2>
                      <p className="text-slate-600 text-sm lg:text-base">
                        Section {currentSection} of {FORM_SECTIONS.length}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/60 text-sm font-medium text-slate-600">
                        {Math.round(((currentSection - 1) / FORM_SECTIONS.length) * 100)}% Complete
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 px-4 py-4">
                  <h2 className="text-lg font-bold text-slate-800 mb-1">
                    {FORM_SECTIONS.find(s => s.id === currentSection)?.title}
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Section {currentSection} of {FORM_SECTIONS.length}
                  </p>
                </div>

                {/* Form Content */}
                <div className="p-4 lg:p-8">
                  {renderCurrentSection()}
                </div>

                {/* Navigation */}
                <div className="bg-slate-50/50 border-t border-slate-200/60 px-4 lg:px-8 py-4 lg:py-6">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleBack}
                      disabled={currentSection === 1}
                      className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Back</span>
                    </button>

                    <div className="flex items-center space-x-1 lg:space-x-2">
                      {FORM_SECTIONS.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all duration-300 ${
                            index < currentSection - 1
                              ? 'bg-emerald-500'
                              : index === currentSection - 1
                              ? 'bg-blue-500'
                              : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentSection === FORM_SECTIONS.length}
                      className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base"
                    >
                      <span className="hidden sm:inline">
                        {currentSection === FORM_SECTIONS.length ? 'Complete' : 'Next'}
                      </span>
                      <span className="sm:hidden">
                        {currentSection === FORM_SECTIONS.length ? '✓' : '→'}
                      </span>
                      <svg className="w-4 h-4 ml-1 lg:ml-2 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
