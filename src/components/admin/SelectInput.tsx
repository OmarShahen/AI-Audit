import React from "react";
import clsx from "clsx";

type SelectInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  options: { value: string; label: string }[];
  className?: string;
};

const SelectInput = ({
  id,
  name,
  value,
  onChange,
  label,
  error,
  required = false,
  disabled = false,
  options,
  className = "",
}: SelectInputProps) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={clsx(
          "w-full px-4 py-2 bg-white shadow-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900",
          error && "border-red-500 focus:ring-red-500",
          disabled && "bg-gray-100 cursor-not-allowed"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectInput;
