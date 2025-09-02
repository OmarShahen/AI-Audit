'use client';

interface FormHeaderProps {
  companyName: string;
  companyLogo: string;
  currentSection: number;
  totalSections: number;
  currentSectionTitle: string;
}

export default function FormHeader({
  companyName,
  companyLogo,
  currentSection,
  totalSections,
  currentSectionTitle
}: FormHeaderProps) {
  const completionPercentage = Math.round(((currentSection - 1) / totalSections) * 100);

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:block bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="h-12 w-12 rounded-lg object-contain bg-white p-1 border border-slate-200"
              onError={(e) => {
                e.currentTarget.src =
                  "/api/placeholder/48/48?text=" +
                  encodeURIComponent(companyName.charAt(0));
              }}
            />
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-1">
                Part {currentSection}: {currentSectionTitle}
              </h2>
              <p className="text-slate-600 text-sm lg:text-base">
                {companyName} • Section {currentSection} of {totalSections}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200/60 text-sm font-medium text-slate-600">
              {completionPercentage}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 px-4 py-4">
        <div className="flex items-center space-x-3 mb-2">
          <img
            src={companyLogo}
            alt={`${companyName} logo`}
            className="h-8 w-8 rounded object-contain bg-white p-1 border border-slate-200"
            onError={(e) => {
              e.currentTarget.src =
                "/api/placeholder/32/32?text=" +
                encodeURIComponent(companyName.charAt(0));
            }}
          />
          <h2 className="text-lg font-bold text-slate-800">
            {currentSectionTitle}
          </h2>
        </div>
        <p className="text-slate-600 text-sm">
          {companyName} • Section {currentSection} of {totalSections}
        </p>
      </div>
    </>
  );
}