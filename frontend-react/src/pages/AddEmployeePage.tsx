import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';

export const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { saveEmployee } = useEmployees();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    dept: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Please fill in required fields');
      return;
    }

    // 1. Save new employee record
    const newEmployee = saveEmployee({
      name: formData.name,
      email: formData.email,
      role: formData.role || 'Software Engineer',
      designation: formData.role || 'Software Engineer',
      dept: formData.dept || 'Engineering',
      status: 'Active',
    }) as any; // saveEmployee may be typed to return void; cast to any to access id if provided

    // 2. Programmatically navigate to the new employee's detail page if an id was returned
    if (newEmployee && newEmployee.id) {
      navigate(`/employees/${newEmployee.id}`);
    } else {
      // fallback: go back to employees list
      navigate('/employees');
    }
    
    // Alternative: Redirect back to employee list page
    // navigate('/employees');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/employees')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#0066cc', color: '#fff', cursor: 'pointer' }}
          >
            Save Employee
          </button>
        </div>
      </form>
    </div>
  );
};