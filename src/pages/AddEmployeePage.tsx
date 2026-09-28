import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/hooks/useEmployees';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    saveEmployee({
      name: formData.name,
      email: formData.email,
      role: formData.role || 'Software Engineer',
      designation: formData.role || 'Software Engineer',
      dept: formData.dept || 'Engineering',
      status: 'Active',
    });

    // 2. Redirect back to employee list page
    navigate('/employees');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Add New Employee" subtitle="Create a new record in the employee directory." />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-(--border-color) bg-white p-6 shadow-(--shadow-sm)"
      >
        <div className="space-y-1.5">
          <Label htmlFor="add-name">Full Name</Label>
          <Input
            id="add-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="add-email">Email Address</Label>
          <Input
            id="add-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-(--border-color) pt-5">
          <button type="button" onClick={() => navigate('/employees')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Employee
          </button>
        </div>
      </form>
    </div>
  );
};
