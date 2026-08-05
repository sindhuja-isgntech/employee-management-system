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

export default EmployeeDashboard1;


// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { employeeApi, ApiEmployee} from '../../../src/api/employeeApi';
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

import React, { useEffect, useState } from 'react';
import { employeeApi, ApiEmployee } from '../../../src/api/employeeApi';
import { Employee } from '../types/employee';

import MetricsGrid from './MetricsGrid';
import { EmployeeCard } from './EmployeeCard';
import { FilterPanel } from './FilterPanel';
import { EditEmployeeModal } from '../components/EditEmployeeModal';
import EmployeeModal from './EmployeeModal';

export interface ModalState {
  isOpen: boolean;
  selectedEmp: Employee | null;
}

export const EmployeeDashboard1: React.FC = () => {
  // --- STATE HOOKS ---
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Add/Edit Modal States
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<ApiEmployee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // --- FETCH EMPLOYEES FROM API ---
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeApi.getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch employee records:', err);
      setError('Unable to load employee records from backend.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- HANDLERS ---
  const handleOpenAddModal = (): void => {
    setAddModalOpen(true);
  };

  const handleOpenEditModal = (emp: ApiEmployee): void => {
    setSelectedEmployeeForEdit(emp);
    setIsEditModalOpen(true);
  };

  const handleEditCard = (id: string): void => {
    const emp = employees.find((item) => item.id === id);
    if (emp) {
      handleOpenEditModal(emp);
    }
  };

  const handleToggleStatus = (id: string): void => {
    setEmployees((prevList) =>
      prevList.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' }
          : emp
      )
    );
  };

  const handleDeleteEmployee = (id: string): void => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees((prevList) => prevList.filter((emp) => emp.id !== id));
    }
  };

  // Called after successful PUT from Edit modal
  const handleEmployeeUpdated = (updatedEmp: ApiEmployee): void => {
    setEmployees((prevList) =>
      prevList.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp))
    );
    setIsEditModalOpen(false);
  };

  // Called after successful POST from Add modal
  const handleEmployeeAdded = (formData: Omit<Employee, 'id'> & { id?: string }): void => {
    const newApiEmployee: ApiEmployee = {
      ...formData,
      id: formData.id ?? String(Date.now()),
      department: (formData as any).dept || (formData as any).department || 'General',
      designation: formData.designation || (formData as any).role || 'Employee',
      status: formData.status || 'Active',
      name: formData.name,
      email: formData.email,
    } as ApiEmployee;

    setEmployees((prevList) => [...prevList, newApiEmployee]);
    setAddModalOpen(false);
  };

  // --- SEARCH AND FILTER LOGIC ---
  const filteredEmployees = employees.filter((emp) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    // Search by Name, Designation, or ID
    const matchesSearch =
      emp.name?.toLowerCase().includes(normalizedSearch) ||
      emp.designation?.toLowerCase().includes(normalizedSearch) ||
      emp.id?.toLowerCase().includes(normalizedSearch);

    // Department match (fallback to 'General' if department field is omitted)
    const empDept = (emp as any).dept || (emp as any).department || 'General';
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
      employees.map((emp) => (emp as any).dept || (emp as any).department || 'General')
    )
  );

  return (
    <div className="app-root min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <main className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        
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

        {/* Dynamic Metrics Cards */}
        <MetricsGrid
          total={employees.length}
          active={employees.filter((e) => e.status?.toLowerCase() === 'active').length}
          other={employees.filter((e) => e.status?.toLowerCase() !== 'active').length}
        />

        {/* Search & Filter Controls */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <p>Loading employee data...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-950/50 dark:bg-red-950/30 dark:text-red-400">
              <p>{error}</p>
              <button
                onClick={fetchEmployees}
                className="mt-2 text-xs font-semibold underline hover:text-red-700"
              >
                Retry Fetching
              </button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <p>No employee records match your search criteria.</p>
            </div>
          ) : (
            <div style={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                       gap: '16px',
                                        }}
                                        >
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="relative group">
                  <EmployeeCard
                    employee={{
                      ...emp,
                      dept: (emp as any).dept || (emp as any).department || 'General',
                      role: (emp as any).role || emp.designation || 'Employee',
                    } as Employee}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteEmployee}
                    onEdit={handleEditCard}
                  />
                  {/* Quick Edit Overlay Button 
                  <button
                    onClick={() => handleOpenEditModal(emp)}
                    className="absolute top-3 right-3 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    Edit
                  </button>*/}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add Employee Modal */}
      <EmployeeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleEmployeeAdded}
        currentEmployee={null}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        employee={selectedEmployeeForEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEmployeeUpdated}
      />
    </div>
  );
};

export default EmployeeDashboard1;

