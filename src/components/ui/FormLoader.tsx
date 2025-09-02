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