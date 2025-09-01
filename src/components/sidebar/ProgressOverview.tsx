interface ProgressOverviewProps {
  currentSection: number;
  totalSections: number;
}

export default function ProgressOverview({ currentSection, totalSections }: ProgressOverviewProps) {
  const completed = currentSection - 1;
  const progressPercentage = (completed / totalSections) * 100;

  return (
    <div className="mb-6 lg:mb-8 p-3 lg:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">Progress</span>
        <span className="text-sm font-bold text-slate-800">
          {completed}/{totalSections}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {completed} of {totalSections} sections completed
      </p>
    </div>
  );
}