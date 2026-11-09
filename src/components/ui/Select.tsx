import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full bg-[#121D32] text-[#F8FAFC] text-sm rounded-xl border border-[#26344D] transition-all duration-200 focus:outline-none focus:border-[#247BFF] focus:ring-1 focus:ring-[#247BFF] disabled:opacity-50 disabled:cursor-not-allowed pl-3.5 pr-10 py-2.5 appearance-none cursor-pointer ${className} ${
              error ? 'border-red-500 focus:border-red-500' : ''
            }`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#121D32] text-[#64748B]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#121D32] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
