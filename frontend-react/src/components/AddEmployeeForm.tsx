import React, { useState, useEffect, useRef } from 'react';
import { Employee, EmployeeStatus } from '../types/employee';
import { useNavigate } from 'react-router-dom';

interface EmployeeFormProps {
  isOpen: boolean;
  currentEmployee: Employee | null;
  onClose: () => void;
  onSave: (formData: Omit<Employee, 'id'> & { id?: string }) => void;
}

// 1. Define interface for controlled state shape
interface EmployeeFormData {
  name: string;
  email: string;
  dept: string;
  role: string;
  designation: string;
  status: EmployeeStatus;
  avatarUrl: string;
}

const INITIAL_FORM_STATE: EmployeeFormData = {
  name: '',
  email: '',
  dept: 'Engineering',
  role: '',
  designation: '',
  status: 'Active',
  avatarUrl: 'https://via.placeholder.com/48',
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  currentEmployee,
  onClose,
  onSave,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 2. Controlled state holding all input values
  const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_FORM_STATE);

  // Synchronize controlled state when editing or opening
  useEffect(() => {
    if (currentEmployee) {
      setFormData({
        name: currentEmployee.name || '',
        email: currentEmployee.email || '',
        dept: currentEmployee.dept || 'Engineering',
        role: currentEmployee.role || '',
        designation: currentEmployee.designation || '',
        status: currentEmployee.status || 'Active',
        avatarUrl: currentEmployee.avatarUrl || 'https://via.placeholder.com/48',
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [currentEmployee, isOpen]);

  // Auto-focus Name field via useRef when form opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 3. Centralized change handler for all controlled inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'status' ? (value as EmployeeStatus) : value,
    }));
  };

  // 4. Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(currentEmployee?.id ? { id: currentEmployee.id } : {}),
      ...formData,
    });
  };

  
  

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-container" style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>
            {currentEmployee ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Employee Name (Controlled & Ref Focused) */}
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Employee Name *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              name="name"
              value={formData.name} // Controlled value
              onChange={handleChange} // Controlled updater
              placeholder="e.g. Sarah Chen"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email} // Controlled value
              onChange={handleChange} // Controlled updater
              placeholder="sarah.chen@company.com"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Department & Status Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label htmlFor="dept" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Department
              </label>
              <select
                id="dept"
                name="dept"
                value={formData.dept} // Controlled value
                onChange={handleChange} // Controlled updater
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status} // Controlled value
                onChange={handleChange} // Controlled updater
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Role *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role} // Controlled value
              onChange={handleChange} // Controlled updater
              placeholder="e.g. Developer"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Designation */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="designation" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Designation
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation} // Controlled value
              onChange={handleChange} // Controlled updater
              placeholder="e.g. Senior Frontend Developer"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Form Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {currentEmployee ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

export default EmployeeForm;