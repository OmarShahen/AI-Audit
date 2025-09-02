'use client';

interface FormNavigationProps {
  currentSection: number;
  totalSections: number;
  onBack: () => void;
  onNext: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

export default function FormNavigation({
  currentSection,
  totalSections,
  onBack,
  onNext,
  isFirstSection,
  isLastSection
}: FormNavigationProps) {
  return (
    <div className="bg-slate-50/50 border-t border-slate-200/60 px-4 lg:px-8 py-4 lg:py-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={isFirstSection}
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
          {Array.from({ length: totalSections }, (_, index) => (
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
          onClick={onNext}
          className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base"
        >
          <span className="hidden sm:inline">
            {isLastSection ? "Complete Assessment" : "Next"}
          </span>
          <span className="sm:hidden">
            {isLastSection ? "✓" : "→"}
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
  );
}