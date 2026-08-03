// src/components/EmployeeCard.tsx
import React from 'react';
import { Employee } from '../types/employee';
import { Link } from 'react-router-dom';

interface EmployeeCardProps {
  employee: Employee;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void; // Prop handler for removing an employee
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onToggleStatus,
  onDelete,
}) => {
  const { name, id, dept, designation, email, status, avatarUrl } = employee;
  const isStatusActive = status === 'Active';

  return (
    <article className="employee-card metric-card">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={avatarUrl || 'https://via.placeholder.com/48'}
          alt={`${name}'s profile`}
          style={{ width: '48px', height: '48px', borderRadius: '50%' }}
        />
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{name}</h4>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>ID: #{id}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , marginTop: '12px' }}>
        <Link
          to={`/employees/${employee.id}`}
          style={{
            padding: '6px 12px',
            fontSize: '0.85rem',
            backgroundColor: '#dee5eb',
            color: '#171d25',
            borderRadius: '8px',
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          View Profile
        </Link>
        </div>

      <div className="card-body" style={{ margin: '16px 0', fontSize: '0.9rem' }}>
        <p style={{ margin: '4px 0' }}><strong>Designation:</strong> {designation}</p>
        <p style={{ margin: '4px 0' }}><strong>Department:</strong> {dept}</p>
        <p style={{ margin: '4px 0' }}><strong>Email:</strong> {email}</p>
      </div>

      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            backgroundColor: isStatusActive ? '#e6f4ea' : '#fce8e6',
            color: isStatusActive ? '#137333' : '#c5221f',
          }}
        >
          {status}
        </span>
        

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Status Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleStatus(id)}
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {isStatusActive ? 'Deactivate' : 'Activate'}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(id)}
            style={{
              padding: '6px 10px',
              fontSize: '0.8rem',
              borderRadius: '4px',
              border: 'none',
              background: '#d93025',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Delete
          </button>

          
        </div>
      </div>
    </article>
  );
};

export default EmployeeCard;

