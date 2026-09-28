import { useState, useEffect } from 'react';
import type { Employee } from '@/types/employee';
import { INITIAL_EMPLOYEES } from '@/utils/constants';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (isMounted) setEmployees(INITIAL_EMPLOYEES);
      } catch (error) {
        console.error('Failed to load employee records:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status.toLowerCase() === 'active' ? 'Inactive' : 'Active' }
          : emp
      )
    );
  };

  const saveEmployee = (formData: Omit<Employee, 'id'> & { id?: string }) => {
    if (formData.id) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === formData.id ? (formData as Employee) : emp))
      );
    } else {
      const newEmp: Employee = {
        ...formData,
        id: Math.floor(1000 + Math.random() * 9000).toString(),
      } as Employee;
      setEmployees((prev) => [...prev, newEmp]);
    }
  };

  const deleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  return {
    employees,
    isLoading,
    toggleStatus,
    saveEmployee,
    deleteEmployee,
  };
};