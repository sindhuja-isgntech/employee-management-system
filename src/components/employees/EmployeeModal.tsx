import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, X } from 'lucide-react';
import type { Employee, EmployeeStatus } from '@/types/employee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


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
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-modal-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-(--shadow-md)">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--border-color) px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--primary-soft) text-(--primary)">
              <UserPlus className="h-5 w-5" />
            </div>
            <h3 id="employee-modal-title" className="text-lg font-semibold text-(--text-main)">
              {currentEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-(--text-light) transition-colors hover:bg-(--bg-subtle) hover:text-(--text-main)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Employee Name - Target for useRef */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Employee Name *</Label>
            <Input
              ref={nameInputRef} // <-- ATTACHED REF HERE
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Chen"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah.chen@company.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="dept">Department</Label>
              <select id="dept" name="dept" value={formData.dept} onChange={handleChange} className={selectClass}>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className={selectClass}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">Role *</Label>
            <Input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Developer"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="designation">Designation</Label>
            <Input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>

          <div className="-mx-6 mt-2 flex justify-end gap-2 border-t border-(--border-color) bg-(--bg-subtle) px-6 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {currentEmployee ? 'Update Record' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const selectClass =
  'h-10 w-full cursor-pointer rounded-lg border border-(--border-color) bg-white px-3 text-sm text-(--text-main) focus:border-(--primary) focus:ring-3 focus:ring-emerald-600/15 focus:outline-none';

export default EmployeeModal;
