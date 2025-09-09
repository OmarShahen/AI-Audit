import React from "react";

interface ConditionalQuestionHintProps {
  hint: string;
  isRequired?: boolean;
}

const ConditionalQuestionHint: React.FC<ConditionalQuestionHintProps> = ({ hint, isRequired = false }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-2">
        <svg
          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="text-blue-800 font-medium text-sm">
            Additional Question Available
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </p>
          <p className="text-blue-700 text-xs mt-1">
            {hint}
            {isRequired && (
              <span className="block text-red-600 font-medium mt-1">
                This question is required and will need to be answered.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConditionalQuestionHint;