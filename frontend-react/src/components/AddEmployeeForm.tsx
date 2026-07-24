import React, { useState } from 'react';
import { Employee, EmployeeStatus } from '../types/employee';

interface AddEmployeeFormProps {
  onAddEmployee: (employee: Employee) => void;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onAddEmployee }) => {
  // 1. Local form state initialized with empty fields
  const [formData, setFormData] = useState({
    name: '',
    dept: 'Engineering',
    role:'',
    designation: '',
    email: '',
    status: 'Active' as EmployeeStatus,
  });

  // 2. Generic change handler for form controls
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation check
    if (!formData.name || !formData.designation || !formData.email) {
      alert('Please fill out all required fields.');
      return;
    }

    // Create new record with auto-generated ID
    const newEmployee: Employee = {
      ...formData,
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      avatarUrl: 'https://via.placeholder.com/48',
    };

    // Pass data up to parent component state
    onAddEmployee(newEmployee);

    // Reset form fields
    setFormData({
      name: '',
      dept: 'Engineering',
      role:'',
      designation: '',
      email: '',
      status: 'Active',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Add New Employee</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Full Name */}
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '6px' }}>
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sarah Chen"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        {/* Designation */}
        <div>
          <label htmlFor="designation" style={{ display: 'block', marginBottom: '6px' }}>
            Designation / Role *
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="e.g. Frontend Engineer"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '6px' }}>
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="sarah.chen@company.com"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" style={{ display: 'block', marginBottom: '6px' }}>
            Department
          </label>
          <select
            id="department"
            name="department"
            value={formData.dept}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" style={{ display: 'block', marginBottom: '6px' }}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Active">Active</option>
            <option value="Onboarding">Inactive</option>
           {/*} <option value="On Leave">On Leave</option>*/}
          </select>
        </div>
      </div>

      <button
        type="submit"
        style={{
          marginTop: '16px',
          padding: '10px 20px',
          background: '#0066cc',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Save Employee
      </button>
    </form>
  );
};

export default AddEmployeeForm;