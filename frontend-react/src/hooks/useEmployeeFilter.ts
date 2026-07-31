import { useState, useMemo } from 'react';
import { Employee, FilterState } from '../types/employee';

export const useEmployeeFilter = (employees: Employee[]) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedDept: 'All',
    selectedStatus: 'All',
  });

  const setSearchTerm = (searchTerm: string) =>
    setFilters((prev) => ({ ...prev, searchTerm }));

  const setSelectedDept = (selectedDept: string) =>
    setFilters((prev) => ({ ...prev, selectedDept }));

  const setSelectedStatus = (selectedStatus: string) =>
    setFilters((prev) => ({ ...prev, selectedStatus }));

  const resetFilters = () =>
    setFilters({ searchTerm: '', selectedDept: 'All', selectedStatus: 'All' });

  // Extract unique departments for dropdown dynamically
  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.dept)));
  }, [employees]);

  // Unified multi-criteria filter (runs without page reloads)
  const filteredEmployees = useMemo(() => {
    const normalizedSearch = filters.searchTerm.trim().toLowerCase();

    return employees.filter((emp) => {
      // 1. Search by Name or ID
      const matchesSearch =
        normalizedSearch === '' ||
        emp.name.toLowerCase().includes(normalizedSearch) ||
        emp.id.toLowerCase().includes(normalizedSearch);

      // 2. Department Filter
      const matchesDept =
        filters.selectedDept === 'All' || emp.dept === filters.selectedDept;

      // 3. Status Filter
      const matchesStatus =
        filters.selectedStatus === 'All' ||
        emp.status.toLowerCase() === filters.selectedStatus.toLowerCase();

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, filters]);

  return {
    filters,
    filteredEmployees,
    departments,
    setSearchTerm,
    setSelectedDept,
    setSelectedStatus,
    resetFilters,
  };
};