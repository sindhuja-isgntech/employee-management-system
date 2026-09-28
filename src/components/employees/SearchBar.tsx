import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by name, role, or dept...',
}) => {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--text-light)" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        aria-label="Search employees"
        className="h-10 w-full rounded-lg border border-(--border-color) bg-(--bg-subtle) py-2 pr-3 pl-9 text-sm text-(--text-main) placeholder:text-(--text-light) focus:border-(--primary) focus:bg-white"
      />
    </div>
  );
};
