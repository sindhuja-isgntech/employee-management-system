import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';

// Example type definition for Employee
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'Active' | 'Inactive' | 'On Leave';
}

// Sample initial data (or pass/fetch via context/API)
const initialEmployees: Employee[] = [
  { id: 'EMP-001', name: 'Sarah Jenkins', role: 'Frontend Engineer', department: 'Engineering', email: 'sarah.j@company.com', status: 'Active' },
  { id: 'EMP-002', name: 'Marcus Chen', role: 'Product Manager', department: 'Product', email: 'marcus.c@company.com', status: 'Active' },
  { id: 'EMP-003', name: 'Elena Rostova', role: 'UX Designer', department: 'Design', email: 'elena.r@company.com', status: 'On Leave' },
  
];

export const EmployeeListPage: React.FC = () => {
  const [employees] = useState<Employee[]>(initialEmployees);
  const navigate = useNavigate();
  // Handler for row/card clicks
  const handleSelectEmployee = (id: string) => {
    navigate(`/employees/${id}`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1a202c' }}>Employees</h1>
          <p style={{ margin: '4px 0 0', color: '#718096', fontSize: '0.95rem' }}>
            Manage and view all registered employee records.
          </p>
        </div>
      </div>

      {/* Employee Records Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Name</th>
              <th style={{ padding: '12px 16px' }}>Role</th>
              <th style={{ padding: '12px 16px' }}>Department</th>
              <th style={{ padding: '12px 16px' }}>Email</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>{emp.id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{emp.name}</td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>{emp.role}</td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>{emp.department}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.9rem' }}>{emp.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor:
                        emp.status === 'Active' ? '#dcfce7' : emp.status === 'On Leave' ? '#fef9c3' : '#f1f5f9',
                      color:
                        emp.status === 'Active' ? '#166534' : emp.status === 'On Leave' ? '#854d0e' : '#475569',
                    }}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
    </div>
  );
};

export default EmployeeListPage;