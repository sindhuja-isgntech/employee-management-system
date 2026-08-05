/*import React from 'react';
import type { Employee } from '../types/employee';

interface EmployeeListProps {
  employees: Employee[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
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

  return (
    <section className="recent-section">
      <div className="section-header">
        <h3>All Records</h3>
        <div className="search-form">
          <input
            type="search"
            placeholder="Search by name, role, or dept..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="employee-cell">
                    <img
                      src={emp.avatarUrl || 'https://via.placeholder.com/28'}
                      alt=""
                      className="avatar-sm"
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
                        onClick={() => onEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => onDelete(emp.id)}
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
  );
};

export default EmployeeList;*/


// Example usage inside React Context or Component
import React, { useEffect, useState } from 'react';
import { employeeService } from '../../../src/services/employeeService';
import type { Employee } from '../../../src/services/employeeService';

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await employeeService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  if (isLoading) return <div>Loading records...</div>;

  return (
    <div>
      {/* Map through employees */}
    </div>
  );
};

export default EmployeeList;