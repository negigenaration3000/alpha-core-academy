import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#121D32] text-[#F8FAFC] placeholder-[#64748B] text-sm rounded-xl pl-10 pr-9 py-2 border border-[#26344D] transition-all duration-200 focus:outline-none focus:border-[#247BFF] focus:ring-1 focus:ring-[#247BFF]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-[#94A3B8] hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
