interface CheckboxOption {
  value: string;
  text: string;
}

interface CheckboxGroupFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: CheckboxOption[];
  required?: boolean;
  description?: string;
  questionNumber?: number;
}

export default function CheckboxGroupField({
  label,
  value,
  onChange,
  options,
  required = false,
  description,
  questionNumber
}: CheckboxGroupFieldProps) {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter((v) => v !== optionValue);
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-slate-700 font-medium text-sm lg:text-base mb-3">
          {questionNumber && (
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3">
              {questionNumber}
            </span>
          )}
          {label}
          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
        {description && (
          <p className="text-xs lg:text-sm text-slate-600 mb-3">{description}</p>
        )}
      </div>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <label
            key={`${option.value}-${index}`}
            className="flex items-start cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
              className="mt-1 rounded border-slate-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-3 text-slate-700 leading-relaxed">
              {option.text}
            </span>
          </label>
        ))}
      </div>
      
      {selectedValues.length > 0 && (
        <div className="text-xs text-slate-500 mt-2">
          {selectedValues.length} item
          {selectedValues.length !== 1 ? "s" : ""} selected
        </div>
      )}
    </div>
  );
}