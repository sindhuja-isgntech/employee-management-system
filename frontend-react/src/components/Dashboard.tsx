// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';
import { Employee } from '../types/employee';
import AddEmployeeForm from './AddEmployeeForm';
import Sidebar from './Sidebar';
import Header from './Header';
import Navbar from './Navbar';
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

export const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 2. Use useEffect to load data on component mount
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

  const handleEdit = (id: string) => {
    console.log(`Edit clicked for employee ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };
  

  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
  };

  {/*const handleToggleStatus = (id: string) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        if (emp.id === id) {
          // Toggle between Active and Inactive
          const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
          return { ...emp, status: newStatus };
        }
        return emp;
      })
    );
  };*/}

  const handleDeleteEmployee = (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this employee record?'
    );

    if (confirmDelete) {
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== id)
      );
    }
  };
  return (
  <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
    {/* Top Navigation / Header */}
      <Header />
      <div className="app-body" style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* 2. Render Sidebar inside dashboard body */}
        <Sidebar />
        {/* Main Content Area */}
        <main className="main-content" style={{ flex: 1, padding: '24px', backgroundColor: '#f8f9fa' }}>
          <header style={{ marginBottom: '20px' }}>
            <h2>Employee Management System</h2>
            <p style={{ color: '#666', margin: 0 }}>
              Total Records: {employees.length}
            </p>
          </header>
      <header style={{ marginBottom: '20px' }}>
        
        {/* 1. Add Employee Form 
      <AddEmployeeForm onAddEmployee={handleAddEmployee} />  */}
        <h2>Employee List</h2>
        <p style={{ color: '#666', margin: 0 }}>
          Total Active Records: {employees.length}
        </p>
      </header>

      {/* 3. Conditional UI rendering based on loading state */}
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <p>Loading employee data...</p>
            </div>
          ) : employees.length === 0 ? (
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
              {employees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  employee={emp}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteEmployee}
                />
              ))}
            </div>
            )}

      {/*{employees.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ color: '#666', margin: 0 }}>No employee records remaining.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      )}

       1. Check for empty state 
      {employees.length === 0 ? (
        <p>No employee records found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginTop: '16px',
          }}
        >
           2. Dynamically map employee state array 
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id} // <-- CRITICAL: Unique & stable key assigned here
              employee={emp}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      )} */}
      </main>
</div>
    </div>
  );
};

export default Dashboard;