import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, isLoading } = useEmployees();

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading employee details...</div>;
  }

  // Find employee matching the route parameter
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
        <h2>Employee Not Found</h2>
        <p style={{ color: '#666' }}>No employee record was found with ID: <strong>#{id}</strong></p>
        <button
          type="button"
          onClick={() => navigate('/employees')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          ← Back to Employee List
        </button>
      </div>
    );
  }

  const isInactive = employee.status.toLowerCase() === 'inactive';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Navigation Breadcrumb / Back Button */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/employees"
          style={{
            color: '#0066cc',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          ← Back to All Employees
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <img
          src={employee.avatarUrl || 'https://via.placeholder.com/96'}
          alt={employee.name}
          style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1e293b' }}>{employee.name}</h1>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: isInactive ? '#fee2e2' : '#dcfce7',
                color: isInactive ? '#991b1b' : '#166534',
              }}
            >
              {employee.status}
            </span>
          </div>
          <p style={{ margin: '4px 0 8px', color: '#64748b', fontSize: '1rem' }}>
            {employee.designation || employee.role}
          </p>
          <span style={{ fontSize: '0.85rem', color: '#0066cc', fontWeight: 600 }}>
            Employee ID: #{employee.id}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Work Information Box */}
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            Work Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>DEPARTMENT</strong>
              <span style={{ color: '#1e293b', fontWeight: 500 }}>{employee.dept}</span>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>ROLE</strong>
              <span style={{ color: '#1e293b', fontWeight: 500 }}>{employee.role}</span>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>DESIGNATION</strong>
              <span style={{ color: '#1e293b', fontWeight: 500 }}>{employee.designation || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Contact Information Box */}
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            Contact & Identification
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>EMAIL ADDRESS</strong>
              <a href={`mailto:${employee.email}`} style={{ color: '#0066cc', textDecoration: 'none' }}>
                {employee.email}
              </a>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>SYSTEM ID</strong>
              <span style={{ color: '#1e293b', fontFamily: 'monospace' }}>{employee.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;