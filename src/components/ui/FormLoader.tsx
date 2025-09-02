'use client';

interface FormLoaderProps {
  questionCount?: number;
  className?: string;
}

export default function FormLoader({ 
  questionCount = 3, 
  className = "" 
}: FormLoaderProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {Array.from({ length: questionCount }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div className="h-24 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

interface QuestionOptionLoaderProps {
  optionCount?: number;
  className?: string;
}

export function QuestionOptionLoader({ 
  optionCount = 3, 
  className = "" 
}: QuestionOptionLoaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          {Array.from({ length: optionCount }, (_, i) => (
            <div key={i} className="h-6 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}