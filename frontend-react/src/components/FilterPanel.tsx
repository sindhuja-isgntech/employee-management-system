import React from 'react';
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

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  selectedDept,
  onDeptChange,
  selectedStatus,
  onStatusChange,
  departments,
}) => {
  return (
    <div
      className="section-header"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ margin: 0 }}>All Records</h3>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
        }}
      >
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
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '0.9rem',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
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
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '0.9rem',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Reset Filters Button (Visible when any filter is active) */}
        {(searchTerm || selectedDept !== 'All' || selectedStatus !== 'All') && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onDeptChange('All');
              onStatusChange('All');
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#f0f0f0',
              color: '#555',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};