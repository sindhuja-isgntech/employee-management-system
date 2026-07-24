import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MetricsGrid from './MetricsGrid';
import EmployeeModal from './EmployeeModal';

const INITIAL_EMPLOYEES = [
  { id: '1024', name: 'Sarah Chen', dept: 'Engineering', role: 'Frontend Developer', status: 'Active' },
  { id: '1025', name: 'Marcus Vance', dept: 'Marketing', role: 'SEO Specialist', status: 'Active' },
  { id: '1026', name: 'Elena Rostova', dept: 'Human Resources', role: 'HR Specialist', status: 'Onboarding' }
];

export default function EmployeeDashboard() {
  // --- STATE HOOKS ---
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, selectedEmp: null });

  // --- HANDLERS ---
  const handleOpenAddModal = () => {
    setModalState({ isOpen: true, selectedEmp: null });
  };

  const handleOpenEditModal = (emp) => {
    setModalState({ isOpen: true, selectedEmp: emp });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, selectedEmp: null });
  };

  // Create or Update record
  const handleSaveEmployee = (formData) => {
    if (modalState.selectedEmp) {
      // UPDATE: Replace item in state array
      setEmployees(prev =>
        prev.map(emp => (emp.id === formData.id ? formData : emp))
      );
    } else {
      // CREATE: Generate new ID and append
      const newEmp = {
        ...formData,
        id: Math.floor(1000 + Math.random() * 9000).toString()
      };
      setEmployees(prev => [...prev, newEmp]);
    }
    handleCloseModal();
  };

  // DELETE record
  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  // Filtered array for live searching
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status Badge Helper
  const getBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'active';
      case 'onboarding': return 'onboarding';
      default: return 'on-leave';
    }
  };

  return (
    <div className="app-root">
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <header className="page-header">
            <div>
              <h2>Employee Management System</h2>
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
            active={employees.filter(e => e.status.toLowerCase() === 'active').length}
            other={employees.filter(e => e.status.toLowerCase() !== 'active').length}
          />

          {/* Table Container Section */}
          <section className="recent-section">
            <div className="section-header">
              <h3>All Records</h3>
              <div className="search-form">
                <input
                  type="search"
                  placeholder="Search by name, role, or dept..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search employees"
                />
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">ID</th>
                    <th scope="col">Department</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map(emp => (
                      <tr key={emp.id}>
                        <td className="employee-cell">
                          <img
                            src="/assets/images/avatars/default-avatar.png"
                            alt=""
                            className="avatar-sm"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/28'; }}
                          />
                          <span>{emp.name}</span>
                        </td>
                        <td>#EMP-{emp.id}</td>
                        <td>{emp.dept}</td>
                        <td>{emp.role}</td>
                        <td>
                          <span className={`status-badge ${getBadgeClass(emp.status)}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button
                              className="btn btn-sm btn-edit"
                              onClick={() => handleOpenEditModal(emp)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-delete"
                              onClick={() => handleDeleteEmployee(emp.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
}