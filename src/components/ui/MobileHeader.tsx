'use client';

interface MobileHeaderProps {
  companyName: string;
  currentSection: number;
  totalSections: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function MobileHeader({
  companyName,
  currentSection,
  totalSections,
  sidebarOpen,
  onToggleSidebar
}: MobileHeaderProps) {
  return (
    <div className="lg:hidden bg-white border-b border-slate-200/60 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="text-center">
          <div className="text-sm font-semibold text-slate-800">
            {companyName}
          </div>
          {totalSections > 0 && (
            <div className="text-xs text-slate-500">
              Part {currentSection} of {totalSections}
            </div>
          )}
        </div>
        {totalSections > 0 && (
          <div className="px-2 py-1 bg-blue-50 rounded-md text-xs font-medium text-blue-600">
            {Math.round(((currentSection - 1) / totalSections) * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}