import React from 'react';
import { RotateCcw } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface FilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDept: string;
  onDeptChange: (dept: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  departments: string[];
}

const selectClass =
  'h-10 min-w-0 flex-1 cursor-pointer rounded-lg sm:flex-none border border-(--border-color) bg-(--bg-subtle) px-3 text-sm text-(--text-main) transition-colors hover:bg-white focus:border-(--primary) focus:bg-white focus:ring-3 focus:ring-emerald-600/15 focus:outline-none';

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  selectedDept,
  onDeptChange,
  selectedStatus,
  onStatusChange,
  departments,
}) => {
  const hasActiveFilters = searchTerm || selectedDept !== 'All' || selectedStatus !== 'All';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-(--text-main)">All Records</h3>
        <p className="text-xs text-(--text-muted)">Search and filter your workforce</p>
      </div>

      <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
        {/* Search Bar (Name / ID) */}
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by Name or ID..."
        />

        {/* Department Dropdown Filter */}
        <select
          value={selectedDept}
          onChange={(e) => onDeptChange(e.target.value)}
          aria-label="Filter by Department"
          className={selectClass}
        >
          <option value="All">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Status Dropdown Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Status"
          className={selectClass}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Reset Filters Button (Visible when any filter is active) */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onDeptChange('All');
              onStatusChange('All');
            }}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-(--text-muted) transition-colors hover:bg-(--primary-soft) hover:text-(--primary)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
