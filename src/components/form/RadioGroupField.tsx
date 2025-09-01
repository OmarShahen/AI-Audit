interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name: string;
  required?: boolean;
  description?: string;
}

export default function RadioGroupField({
  label,
  value,
  onChange,
  options,
  name,
  required = false,
  description
}: RadioGroupFieldProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-700 font-medium text-sm lg:text-base mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs lg:text-sm text-slate-600">{description}</p>
        )}
      </div>
      
      <div className="space-y-2 lg:space-y-3">
        {options.map((option) => (
          <label 
            key={option.value} 
            className="flex items-center space-x-3 cursor-pointer group p-2 lg:p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2 transition-colors duration-200 flex-shrink-0"
            />
            <span className={`text-sm lg:text-base transition-colors duration-200 ${
              value === option.value 
                ? 'text-slate-800 font-medium' 
                : 'text-slate-600 group-hover:text-slate-700'
            }`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}