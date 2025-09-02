import { FormSection } from '@/types';

interface SectionNavigationItemProps {
  section: FormSection;
  status: 'completed' | 'current' | 'pending';
  isClickable?: boolean;
  onClick?: () => void;
  showConnectionLine?: boolean;
}

export default function SectionNavigationItem({ 
  section, 
  status, 
  isClickable = false, 
  onClick,
  showConnectionLine = false 
}: SectionNavigationItemProps) {
  const StatusIndicator = () => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'current':
        return (
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full"></div>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-slate-300 rounded-full bg-white flex items-center justify-center">
            <span className="text-xs lg:text-sm font-medium text-slate-400">{section.id}</span>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      <div 
        className={`
          group flex items-center p-3 lg:p-4 rounded-xl transition-all duration-300 ease-out
          ${status === 'current' 
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md' 
            : status === 'completed'
            ? 'bg-white/80 border border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white'
            : 'bg-slate-50/50 border border-slate-100'
          }
          ${isClickable ? 'cursor-pointer' : ''}
        `}
        onClick={() => isClickable && onClick?.()}
      >
        {/* Status Indicator */}
        <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full mr-3 lg:mr-4 flex-shrink-0">
          <StatusIndicator />
        </div>

        {/* Section Info */}
        <div className="flex-1 min-w-0">
          <div className={`text-xs lg:text-sm font-semibold mb-1 ${
            status === 'current' 
              ? 'text-blue-700' 
              : status === 'completed'
              ? 'text-slate-700'
              : 'text-slate-500'
          }`}>
            Part {section.id}
          </div>
          <div className={`text-xs lg:text-sm leading-tight ${
            status === 'current' 
              ? 'text-blue-600 font-medium' 
              : status === 'completed'
              ? 'text-slate-600'
              : 'text-slate-400'
          }`}>
            {section.title}
          </div>
        </div>

        {/* Chevron for completed sections */}
        {status === 'completed' && isClickable && (
          <svg className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>

      {/* Connection Line */}
      {showConnectionLine && (
        <div className="absolute left-9 top-16 w-0.5 h-6 bg-gradient-to-b from-slate-200 to-slate-100"></div>
      )}
    </div>
  );
}