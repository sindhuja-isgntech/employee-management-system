/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeContext } from '../context/EmployeeContext';

/* Example type definition for Employee
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
  const [employees,setEmployees] = useState<Employee[]>(initialEmployees);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
        let isMounted = true; // Cleanup flag to prevent memory leaks on unmount
    
        const loadEmployeeData = async (): Promise<void> => {
          setIsLoading(true);
    
          try {
            // Simulate an asynchronous API network call with a 1-second delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
    
            if (isMounted) {
              setEmployees(initialEmployees);
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
        return () => {
        isMounted = false;
      };
    }, []);

  //if (isLoading) return <div>Loading employees...</div>;

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

      * Employee Records Table *
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

export default EmployeeListPage; */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEmployeeContext } from '../context/EmployeeContext';

import { Input } from '../../../src/components/ui/input';
import { Button } from '../../../src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../src/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../src/components/ui/select';
// Type definitions matching JSONPlaceholder's /users API response
interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    bs: string;
  };
}

// Fetcher function
const fetchEmployees = async (): Promise<ApiUser[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to load employee directory.');
  }
  return response.json();
};

export const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();

  // TanStack Query hook
  const { data: employees, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['employees-jsonplaceholder'],
    queryFn: fetchEmployees,
  });

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Loading employee list from server...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', margin: '20px' }}>
        <h3 style={{ margin: '0 0 8px', color: '#991b1b' }}>Error Loading Employees</h3>
        <p style={{ margin: '0 0 16px', color: '#7f1d1d' }}>{(error as Error).message}</p>
        <button
          onClick={() => refetch()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#0f172a' }}>
            Employee Directory ({employees?.length})
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Live data fetched from JSONPlaceholder API
          </p>
        </div>
      </div>

      {/* Grid of Employee Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {employees?.map((emp) => (
          <div
            key={emp.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            {/* Main Info */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#0066cc',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                  }}
                >
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b' }}>{emp.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>@{emp.username}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{ margin: 0 }}>
                  <strong>Role:</strong> {emp.company.bs}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Department:</strong> {emp.company.name}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Email:</strong> {emp.email}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Website:</strong> {emp.website}
                </p>
              </div>
            </div>

            {/* Bottom Card Action */}
            <div
              style={{
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
              }}
            >
              <button
                type="button"
                onClick={() => navigate(`/employees/${emp.id}`)}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: '#0066cc',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                View Profile →
              </button>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default EmployeeListPage;

