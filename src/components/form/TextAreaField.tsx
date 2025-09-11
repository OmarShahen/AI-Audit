interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
  rows?: number;
  required?: boolean;
  questionNumber?: number;
}

export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  maxLength,
  showCharacterCount = false,
  rows = 4,
  required = false,
  questionNumber
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-slate-700 font-medium text-sm lg:text-base">
        {questionNumber && (
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3">
            {questionNumber}
          </span>
        )}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className="w-full p-3 lg:p-4 border border-slate-300 rounded-xl resize-none text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-slate-400 bg-white text-sm lg:text-base"
      />
      {showCharacterCount && maxLength && (
        <div className="text-right">
          <span className={`text-xs lg:text-sm ${
            value.length > maxLength * 0.9 
              ? 'text-amber-600' 
              : value.length === maxLength 
              ? 'text-red-500' 
              : 'text-slate-500'
          }`}>
            {value.length}/{maxLength} characters
          </span>
        </div>
      )}
    </div>
  );
}