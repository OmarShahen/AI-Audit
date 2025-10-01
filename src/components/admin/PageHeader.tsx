import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export const PageHeader = ({ title, description, icon }: PageHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-indigo-600">{icon}</div>
            </div>
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
