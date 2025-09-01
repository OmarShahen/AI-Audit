import TextAreaField from './TextAreaField';

interface ConditionalTextAreaProps {
  condition: boolean;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function ConditionalTextArea({
  condition,
  label = "Please provide details:",
  value,
  onChange,
  placeholder = "Please describe...",
  rows = 3
}: ConditionalTextAreaProps) {
  if (!condition) return null;

  return (
    <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-blue-50/50 border border-blue-200/50 rounded-xl">
      <TextAreaField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}