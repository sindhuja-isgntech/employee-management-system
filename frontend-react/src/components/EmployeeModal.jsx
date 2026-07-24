import React, { useState, useEffect } from 'react';

export default function EmployeeModal({ isOpen, onClose, onSave, currentEmployee }) {
  const [formData, setFormData] = useState({
    name: '',
    dept: 'Engineering',
    role: '',
    status: 'Active'
  });

  // Pre-fill form when editing, or reset when adding new
  useEffect(() => {
    if (currentEmployee) {
      setFormData(currentEmployee);
    } else {
      setFormData({
        name: '',
        dept: 'Engineering',
        role: '',
        status: 'Active'
      });
    }
  }, [currentEmployee, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal open" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Sarah Chen"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dept">Department</label>
            <select id="dept" name="dept" value={formData.dept} onChange={handleChange}>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role / Position</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}