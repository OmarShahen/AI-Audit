interface SidebarHeaderProps {
  companyName?: string;
  companyLogo?: string;
}

export default function SidebarHeader({ companyName, companyLogo }: SidebarHeaderProps) {
  return (
    <div className="mb-6 lg:mb-10">
      {companyLogo ? (
        <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl mb-3 lg:mb-4 shadow-lg border border-slate-200">
          <img 
            src={companyLogo} 
            alt={`${companyName} logo`}
            className="w-8 h-8 lg:w-9 lg:h-9 object-contain"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/36/36?text=' + encodeURIComponent((companyName || 'C').charAt(0));
            }}
          />
        </div>
      ) : (
        <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-3 lg:mb-4 shadow-lg">
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
      {companyName ? (
        <>
          <h1 className="text-lg lg:text-xl font-bold text-slate-800 mb-1 tracking-tight">
            {companyName}
          </h1>
          <h2 className="text-base lg:text-lg font-semibold text-slate-600 tracking-tight">
            AI & Automation Audit
          </h2>
        </>
      ) : (
        <>
          <h1 className="text-lg lg:text-xl font-bold text-slate-800 mb-1 tracking-tight">
            Revi AI & Automation
          </h1>
          <h2 className="text-base lg:text-lg font-semibold text-slate-600 tracking-tight">
            Readiness Audit
          </h2>
        </>
      )}
      <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-2 lg:mt-3"></div>
    </div>
  );
}