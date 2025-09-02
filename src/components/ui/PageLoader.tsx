'use client';

interface PageLoaderProps {
  message?: string;
  subtitle?: string;
}

export default function PageLoader({ 
  message = "Loading company data", 
  subtitle = "Please wait while we fetch your information..." 
}: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-lg font-medium text-slate-800">{message}</p>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex justify-center space-x-1 mt-4">
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}