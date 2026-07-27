import React, { useState, useEffect, useRef } from 'react';
import { Employee, EmployeeStatus } from '../types/employee'; // Import EmployeeStatus


interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Omit<Employee, 'id'> & { id?: string }) => void;
  currentEmployee: Employee | null;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentEmployee,
}) => {
  // 1. Create a reference typed for HTML input elements
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    dept: 'Engineering',
    role: '',
    designation: '',
    email: '',
    status:'Active' as EmployeeStatus,
    avatarUrl: 'https://via.placeholder.com/48',
  });

  // Hydrate or reset form values when opening or switching modes
  useEffect(() => {
    if (currentEmployee) {
      setFormData({
        name: currentEmployee.name,
        dept: currentEmployee.dept,
        role: currentEmployee.role,
        designation: currentEmployee.designation,
        email: currentEmployee.email,
        status: currentEmployee.status,
        avatarUrl: currentEmployee.avatarUrl || 'https://via.placeholder.com/48',
      });
    } else {
      setFormData({
        name: '',
        dept: 'Engineering',
        role: '',
        designation: '',
        email: '',
        status: 'Active',
        avatarUrl: 'https://via.placeholder.com/48',
      });
    }
  }, [currentEmployee, isOpen]);

  // 2. Automatically focus the name input when the modal becomes visible
  useEffect(() => {
    if (isOpen) {
      // A small timeout ensures the modal is fully mounted in the DOM before focusing
      const focusTimer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);

      return () => clearTimeout(focusTimer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>
            {currentEmployee ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Employee Name - Target for useRef */}
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Employee Name *
            </label>
            <input
              ref={nameInputRef} // <-- ATTACHED REF HERE
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Chen"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah.chen@company.com"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label htmlFor="dept" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Department
              </label>
              <select
                id="dept"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
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
                value={formData.status}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Role *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Developer"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="designation" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Designation
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Developer"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: '4px' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#0066cc', color: '#fff', border: 'none' }}>
              {currentEmployee ? 'Update Record' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline Layout Styles
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

export default EmployeeModal;