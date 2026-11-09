import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[#94A3B8] pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[#121D32] text-[#F8FAFC] placeholder-[#64748B] text-sm rounded-xl border border-[#26344D] transition-all duration-200 focus:outline-none focus:border-[#247BFF] focus:ring-1 focus:ring-[#247BFF] disabled:opacity-50 disabled:cursor-not-allowed ${
              icon ? 'pl-10' : 'pl-3.5'
            } ${rightElement ? 'pr-10' : 'pr-3.5'} py-2.5 ${className} ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-[#94A3B8] flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
