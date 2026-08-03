import React, { useState } from 'react';
//import Navbar from '../components/Navbar';
//import Sidebar from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
//import MetricsGrid from '../components/MetricsGrid.jsx';
import { FilterPanel } from '../components/FilterPanel';
import { EmployeeList } from '../components/EmployeeList';
import { EmployeeForm } from '../components/AddEmployeeForm';

import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeFilter } from '../hooks/useEmployeeFilter';
import type { ModalState } from '../types/employee';
import type { Employee } from '../types/employee';

export const DashboardPage: React.FC = () => {
  const { employees, isLoading, toggleStatus, saveEmployee, deleteEmployee } = useEmployees();

  const {
    filters,
    filteredEmployees,
    departments,
    setSearchTerm,
    setSelectedDept,
    setSelectedStatus,
  } = useEmployeeFilter(employees);

  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, selectedEmp: null });

  const handleOpenAddModal = () => setModalState({ isOpen: true, selectedEmp: null });
  const handleOpenEditModal = (emp: Employee) => setModalState({ isOpen: true, selectedEmp: emp });
  const handleCloseModal = () => setModalState({ isOpen: false, selectedEmp: null });

  const handleSave = (formData: Omit<Employee, "id"> & { id?: string }) => {
    saveEmployee(formData);
    handleCloseModal();
  };

  return (
    <div className="app-root">
      {/* <Navbar /> */}

      <div className="app-body">
        {/* <Sidebar /> */}

        <main className="main-content">
          <DashboardHeader
            title="Employee Management System"
            subtitle="Manage, track, and update employee records in real time."
            onAddNew={handleOpenAddModal}
          />

          {/* <MetricsGrid
            total={employees.length}
            active={employees.filter((e) => e.status.toLowerCase() === 'active').length}
            other={employees.filter((e) => e.status.toLowerCase() !== 'active').length}
          /> */}

          <section className="recent-section">
            <FilterPanel
              searchTerm={filters.searchTerm}
              selectedDept={filters.selectedDept}
              selectedStatus={filters.selectedStatus}
              departments={departments}
              onSearchChange={setSearchTerm}
              onDeptChange={setSelectedDept}
              onStatusChange={setSelectedStatus}
              //onReset={resetFilters}
            />

            <EmployeeList
                employees={filteredEmployees}
                onDelete={deleteEmployee}
                onEdit={handleOpenEditModal}
                searchTerm={filters.searchTerm}
                onSearchChange={setSearchTerm}
            />
          </section>
        </main>
      </div>

      <EmployeeForm
        isOpen={modalState.isOpen}
        currentEmployee={modalState.selectedEmp}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

      <footer className="app-footer">
        <p>&copy; 2026 Employee Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;