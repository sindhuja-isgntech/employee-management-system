/*import React, { useState, useEffect, useRef } from 'react';
import type { Employee, EmployeeStatus } from '../types/employee';
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
          {/* Employee Name (Controlled & Ref Focused) *
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Employee Name 
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

          {/* Email 
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

          {/* Department & Status Row 
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

          {/* Role 
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

          {/* Designation 
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

          {/* Form Action Buttons 
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

export default EmployeeForm;*/


import React, { useState } from 'react';
import { employeeApi, type ApiEmployee } from '@/api/employeeApi';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface NewEmployeePayload {
  name: string;
  email: string;
  department: string;
  designation: string;
  mobile: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_FORM_STATE: NewEmployeePayload = {
  name: '',
  email: '',
  department: '',
  designation: '',
  mobile: '',
  status: 'Active',
};

interface AddEmployeeFormProps {
  onSuccess: (newEmployee: ApiEmployee) => void;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<NewEmployeePayload>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Auto-dismiss notification helper
  const triggerSuccessNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000); // Clears alert after 3 seconds
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    try {
      const createdEmployee = await employeeApi.createEmployee(formData);

      // 1. Reset form input state back to default empty values
      resetForm();

      // 2. Trigger auto-dismissing success toast/alert notification
      triggerSuccessNotification(`Employee "${formData.name}" was added successfully!`);

      // 3. Notify parent component to update employee list UI
      onSuccess(createdEmployee);
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Failed to save employee. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add New Employee</h3>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700 transition-all dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* API Error Notification */}
      {apiError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-1">
        <Label htmlFor="name">Employee Name *</Label>
        <Input
          id="name"
          required
          disabled={loading}
          placeholder="e.g. Sarah Chen"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Email Input */}
      <div className="space-y-1">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          required
          disabled={loading}
          placeholder="e.g. sarah.chen@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Designation Input */}
        <div className="space-y-1">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            id="designation"
            required
            disabled={loading}
            placeholder="e.g. Senior Developer"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          />
        </div>

        {/* Mobile Input */}
        <div className="space-y-1">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            type="tel"
            required
            disabled={loading}
            placeholder="e.g. 9876543210"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
        </div>
      </div>

      {/* Department Dropdown */}
      <div className="space-y-1">
        <Label>Department *</Label>
         <select
    id="department"
    value={formData.department}
    onChange={(e) =>
      setFormData({
        ...formData,
        department: e.target.value,
      })
    }
    className="h-10 w-full rounded-md border border-gray-300 px-3 py-2"
  >
    <option value="Engineering">Engineering</option>
    <option value="Marketing">Marketing</option>
    <option value="Human Resources">Human Resources</option>
    <option value="Finance">Finance</option>
  </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Add Employee'
        )}
      </Button>
    </form>
  );
};

export default AddEmployeeForm;