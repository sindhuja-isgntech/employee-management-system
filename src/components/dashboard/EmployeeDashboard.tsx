/*import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

import MetricsGrid from './MetricsGrid';
import EmployeeModal from './EmployeeModal.tsx';

import { Employee } from '../types/employee';
import { EmployeeCard } from './EmployeeCard';
import { FilterPanel } from './FilterPanel.tsx';
import { Header } from './Header.tsx';
import Sidebar  from './Sidebar.tsx';
 // Import the CSS file for styling

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

export const EmployeeDashboard: React.FC = () => {
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
      {/*<Header />*

      <div className="app-body">
        {/*<Sidebar />*

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
           
           
          

          {/* Metric Overview Cards with Dynamic Counts *
          <MetricsGrid
            total={employees.length}
            active={employees.filter((e) => e.status.toLowerCase() === 'active').length}
            other={employees.filter((e) => e.status.toLowerCase() !== 'active').length}
          />

          {/* Table Container Section *
          <section className="recent-section">
            <div className="section-header">
              {/*<h3>All Records</h3>
              {/*<div className="search-form">
                <input
                  type="search"
                  placeholder="Search by name or role..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  aria-label="Search employees"
                />
              </div>
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

            

            {/* 3. Conditional UI rendering based on loading state *
                    {isLoading ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <p>Loading employee data...</p>
                      </div>
                    ) : filteredEmployees.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <p>No employee records found.</p>
                      </div>
                    ) : (
                      <div style={{
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

      

      {/* CRUD Modal Form *
      <EmployeeModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        currentEmployee={modalState.selectedEmp}
      />

      
    </div>
  );
};

export default EmployeeDashboard;


// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeApi, ApiEmployee} from '@/api/employeeApi';
import { EmployeeCard } from '../components/EmployeeCard';
import { EditEmployeeModal } from '../components/EditEmployeeModal';
import { Employee } from '../types/employee';

export const DashboardPage: React.FC = () => {
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal State
  const [selectedEmployee, setSelectedEmployee] = useState<ApiEmployee | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeApi.getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Open edit modal for an employee
  const handleEditClick = (emp: ApiEmployee) => {
    setSelectedEmployee(emp);
    setIsEditOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setEmployees((prevList) =>
      prevList.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' }
          : emp
      )
    );
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prevList) => prevList.filter((emp) => emp.id !== id));
  };

  // Update employee list state after successful PUT
  const handleEmployeeUpdated = (updatedEmp: ApiEmployee) => {
    setEmployees((prevList) =>
      prevList.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp))
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Employee Records</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={{
                ...emp,
                dept: 'General',
                role: 'Employee',
              } as Employee}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      )}

      {/* Edit Employee Modal 
      <EditEmployeeModal
        isOpen={isEditOpen}
        employee={selectedEmployee}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEmployeeUpdated}
      />
    </div>
  );
};

export default DashboardPage;*/

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '@/api/employeeApi';
import type { Employee } from '@/types/employee';

import { AlertCircle, RefreshCw, SearchX } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import MetricsGrid from './MetricsGrid';
import { EmployeeCard } from '@/components/employees/EmployeeCard';
import { FilterPanel } from '@/components/employees/FilterPanel';

export const EmployeeDashboard: React.FC = () => {
  // --- STATE HOOKS ---
  const {
    data: employees = [],
    isLoading: loading,
    error,
    refetch: fetchEmployees,
  } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getEmployees,
  });

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // --- SEARCH AND FILTER LOGIC ---
  const filteredEmployees = employees.filter((emp) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    // Search by Name, Designation, or ID
    const matchesSearch =
      emp.name?.toLowerCase().includes(normalizedSearch) ||
      emp.designation?.toLowerCase().includes(normalizedSearch) ||
      String(emp.id).toLowerCase().includes(normalizedSearch);

    // Department match (fallback to 'General' if department field is omitted)
    const empDept = emp.department || 'General';
    const matchesDept = selectedDept === 'All' || empDept === selectedDept;

    // Status match
    const matchesStatus =
      selectedStatus === 'All' ||
      emp.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Extract unique departments dynamically for the filter dropdown
  const uniqueDepartments = Array.from(
    new Set(
      employees.map((emp) => emp.department || 'General')
    )
  );

  return (
    <div>
      <main className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Manage, track, and update employee records in real time."
        />

        {/* Dynamic Metrics Cards */}
        <MetricsGrid
          total={employees.length}
          active={employees.filter((e) => e.status?.toLowerCase() === 'active').length}
          other={employees.filter((e) => e.status?.toLowerCase() !== 'active').length}
        />

        {/* Search & Filter Controls */}
        <section className="card p-4 sm:p-5">
          <FilterPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDept={selectedDept}
            onDeptChange={setSelectedDept}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            departments={uniqueDepartments}
          />
        </section>

        {/* Dynamic Records Grid */}
        <section className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading employee data">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="card p-5">
                  <div className="flex items-center gap-3">
                    <div className="skeleton h-11 w-11 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3.5 w-2/3" />
                      <div className="skeleton h-3 w-1/3" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    <div className="skeleton h-3 w-4/5" />
                    <div className="skeleton h-3 w-3/5" />
                    <div className="skeleton h-3 w-2/3" />
                  </div>
                </div>
              ))}
              <span className="sr-only">Loading employee data...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
              <AlertCircle className="h-6 w-6" />
              <p className="text-sm font-medium">{error instanceof Error ? error.message : 'Unable to load employee records.'}</p>
              <button type="button" onClick={() => void fetchEmployees()} className="btn btn-secondary btn-sm mt-2">
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-(--border-color) bg-white p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--primary-soft) text-(--primary)">
                <SearchX className="h-6 w-6" />
              </div>
              <p className="mt-1 font-medium text-(--text-main)">No matching employees</p>
              <p className="text-sm text-(--text-muted)">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEmployees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  employee={{
                    ...emp,
                    dept: emp.department || 'General',
                    role: emp.designation || 'Employee',
                  } as Employee}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </section>
      </main>

    </div>
  );
};

export default EmployeeDashboard;

