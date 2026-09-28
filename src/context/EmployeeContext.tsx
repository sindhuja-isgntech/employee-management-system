import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Employee } from '@/types/employee';

// Define the shape of our context state
interface EmployeeContextType {
  employees: Employee[];
  isLoading: boolean;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  deleteEmployee: (id: string) => void;
  updateEmployee: (id: string, updatedData: Partial<Employee>) => void;
}

// Initial mock data
const initialEmployees: Employee[] = [
  {
    id: '101',
    name: 'Sarah Jenkins',
    role: 'Senior Frontend Engineer',
    dept: 'Engineering',
    email: 'sarah.j@company.com',
    status: 'Active',
    designation: 'Senior Frontend Engineer',
  },
  {
    id: '102',
    name: 'Marcus Chen',
    role: 'Product Manager',
    dept: 'Product',
    email: 'marcus.c@company.com',
    status: 'Active',
    designation: 'Product Manager',
  },
];

// Create context with default undefined value
const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

// Provider Component
export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isLoading] = useState<boolean>(false);

  const addEmployee = (newEmpData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...newEmpData,
      id: String(Date.now()),
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const updateEmployee = (id: string, updatedData: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updatedData } : emp))
    );
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        isLoading,
        addEmployee,
        deleteEmployee,
        updateEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useEmployeeContext = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
};