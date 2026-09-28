/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/hooks/useEmployees';
import { useEmployeeContext } from '@/context/EmployeeContext';

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
import { Loader2, AlertCircle, RefreshCw, Briefcase, Building2, Mail, Globe, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';

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
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-(--border-color) bg-white p-16 text-(--text-muted)">
        <Loader2 className="h-7 w-7 animate-spin text-(--primary)" />
        <p className="text-sm font-medium">Loading employee list from server...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
        <h3 className="mt-3 text-base font-semibold text-rose-800">Error Loading Employees</h3>
        <p className="mt-1 text-sm text-rose-700">{(error as Error).message}</p>
        <button type="button" onClick={() => refetch()} className="btn btn-secondary btn-sm mt-4">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            Employee Directory
            <span className="rounded-full bg-(--primary-soft) px-2.5 py-0.5 text-sm font-semibold text-(--primary)">
              {employees?.length ?? 0}
            </span>
          </span>
        }
        subtitle="Live data fetched from JSONPlaceholder API"
      />

      {/* Grid of Employee Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {employees?.map((emp) => (
          <article
            key={emp.id}
            className="group flex flex-col rounded-xl border border-(--border-color) bg-white shadow-(--shadow-sm) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-md)"
          >
            {/* Main Info */}
            <div className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <InitialsAvatar name={emp.name} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-(--text-main)">{emp.name}</h3>
                  <span className="text-xs text-(--text-light)">@{emp.username}</span>
                </div>
              </div>

              <dl className="space-y-2 text-sm text-(--text-muted)">
                <div className="flex items-start gap-2">
                  <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-(--text-light)" />
                  <dt className="sr-only">Role</dt>
                  <dd className="line-clamp-1 capitalize">{emp.company.bs}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-(--text-light)" />
                  <dt className="sr-only">Department</dt>
                  <dd className="truncate text-(--text-main)">{emp.company.name}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-(--text-light)" />
                  <dt className="sr-only">Email</dt>
                  <dd className="truncate">{emp.email}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 shrink-0 text-(--text-light)" />
                  <dt className="sr-only">Website</dt>
                  <dd className="truncate">{emp.website}</dd>
                </div>
              </dl>
            </div>

            {/* Bottom Card Action */}
            <div className="mt-auto rounded-b-xl border-t border-(--border-color) bg-(--bg-subtle) px-5 py-3">
              <button
                type="button"
                onClick={() => navigate(`/employees/${emp.id}`)}
                className="btn btn-primary w-full"
              >
                View Profile
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default EmployeeListPage;
