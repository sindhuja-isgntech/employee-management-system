import React, { useState,useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MetricsGrid from './MetricsGrid';
import EmployeeModal from './EmployeeModal.tsx';

import { Employee } from '../types/employee';
import { EmployeeCard } from './EmployeeCard';
import { FilterPanel } from './FilterPanel.tsx';
import { Header } from './Header.tsx';

// --- TYPES & INTERFACES ---
export type EmployeeStatus = 'Active' | 'Inactive' | string;


export interface ModalState {
  isOpen: boolean;
  selectedEmp: Employee | null;
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1024',
    name: 'Sarah Chen',
    dept: 'Engineering',
    role: 'Developer',
    designation: 'Senior Frontend Developer',
    email: 'sarah.chen@company.com',
    status: 'Active',
    avatarUrl: 'https://via.placeholder.com/48',
  },
  {
    id: '1025',
    name: 'Marcus Vance',
    dept: 'Marketing',
    role:'SEO specialist',
    designation: 'SEO Specialist',
    email: 'marcus.vance@company.com',
    status: 'Inactive',
    avatarUrl: 'https://via.placeholder.com/48',
  },
  {
    id: '1026',
    name: 'Elena Rostova',
    dept: 'Human Resources',
    role:'Human Resources',
    designation: 'HR Generalist',
    email: 'elena.rostova@company.com',
    status: 'Active',
    avatarUrl: 'https://via.placeholder.com/48',
  },
];

export const EmployeeDashboard1: React.FC = () => {
  // --- STATE HOOKS ---
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, selectedEmp: null });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  // --- HANDLERS ---
  const handleOpenAddModal = (): void => {
    setModalState({ isOpen: true, selectedEmp: null });
  };

  const handleOpenEditModal = (emp: Employee): void => {
    setModalState({ isOpen: true, selectedEmp: emp });
  };

  const handleCloseModal = (): void => {
    setModalState({ isOpen: false, selectedEmp: null });
  };

  useEffect(() => {
      let isMounted = true; // Cleanup flag to prevent memory leaks on unmount
  
      const loadEmployeeData = async (): Promise<void> => {
        setIsLoading(true);
  
        try {
          // Simulate an asynchronous API network call with a 1-second delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
  
          if (isMounted) {
            setEmployees(INITIAL_EMPLOYEES);
          }
        } catch (error) {
          console.error('Failed to load employee records:', error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };
      loadEmployeeData();
  
      // Cleanup function
      return () => {
        isMounted = false;
      };
    }, []); // Empty dependency array ensures this effect runs ONLY ONCE when the app starts
  
    // Handlers
    const handleToggleStatus = (id: string): void => {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id
            ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' }
            : emp
        )
      );
    };

  // Create or Update record
  const handleSaveEmployee = (formData: Omit<Employee, 'id'> & { id?: string }): void => {
    if (modalState.selectedEmp) {
      // UPDATE: Replace item in state array
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === formData.id ? (formData as Employee) : emp))
      );
    } else {
      // CREATE: Generate new ID and append
      const newEmp: Employee = {
        ...formData,
        id: Math.floor(1000 + Math.random() * 9000).toString(),
      } as Employee;
      setEmployees((prev) => [...prev, newEmp]);
    }
    handleCloseModal();
  };

  // DELETE record
  const handleDeleteEmployee = (id: string): void => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  // Filtered array for live searching
  const filteredEmployees = employees.filter((emp) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  // Match by Name or ID
  const matchesNameOrId =
    emp.name.toLowerCase().includes(normalizedSearch) ||
    emp.id.toLowerCase().includes(normalizedSearch);

    // Check Department match
    const matchesDept = selectedDept === 'All' || emp.dept === selectedDept;

    // Check Status match (case-insensitive)
    const matchesStatus =
      selectedStatus === 'All' ||
      emp.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesNameOrId && matchesDept && matchesStatus;
});

  // Status Badge Helper
  const getBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'active';
      case 'onboarding':
        return 'onboarding';
      default:
        return 'on-leave';
    }
  };

  // Image Fallback Handler for TS
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    e.currentTarget.src = 'https://via.placeholder.com/28';
  };



  
  return (
    <div className="app-root">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <header className="page-header">
            <div>
              <h2>EMS Dashboard</h2>
              <p>Welcome back! Manage, track, and update employee records in real time.</p>
            </div>
            <div className="quick-actions">
              <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
                + Add New Employee
              </button>
            </div>
          </header>
           
           
          

          {/* Metric Overview Cards with Dynamic Counts */}
          <MetricsGrid
            total={employees.length}
            active={employees.filter((e) => e.status.toLowerCase() === 'active').length}
            other={employees.filter((e) => e.status.toLowerCase() !== 'active').length}
          />

          {/* Table Container Section */}
          <section className="recent-section">
            <div className="section-header">
              //<h3>All Records</h3>
              {/*<div className="search-form">
                <input
                  type="search"
                  placeholder="Search by name or role..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  aria-label="Search employees"
                />
              </div>*/}
            </div>

            <section className="recent-section">
            <FilterPanel
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDept={selectedDept}
              onDeptChange={setSelectedDept}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
             departments={Array.from(new Set(employees.map((emp) => emp.dept)))}
            />
            </section>

            

            {/* 3. Conditional UI rendering based on loading state */}
                    {isLoading ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <p>Loading employee data...</p>
                      </div>
                    ) : filteredEmployees.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <p>No employee records found.</p>
                      </div>
                    ) : (
                      <div 
                                 style={{
                                                 display: 'grid',
                                                 gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                                 gap: '16px',
                                               }}
                                             >
                                               {filteredEmployees.map((emp) => (
                                                 <EmployeeCard
                                                   key={emp.id}
                                                   employee={emp}
                                                   onToggleStatus={handleToggleStatus}
                                                   onDelete={handleDeleteEmployee}
                                                 />
                                               ))}
                      </div>
                      )}

            
          </section>
        </main>
      </div>

      

      {/* CRUD Modal Form */}
      <EmployeeModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        currentEmployee={modalState.selectedEmp}
      />

      <footer className="app-footer">
        <p>&copy; 2026 Employee Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeDashboard1;