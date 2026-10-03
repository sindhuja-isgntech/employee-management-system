import React, { useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import type { EmployeeRequest, ApiEmployee } from '@/api/employeeApi';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DepartmentRecord } from '@/services/hrmsDataService';

interface EmployeeFormModalProps {
  employee: ApiEmployee | null;
  departments: DepartmentRecord[];
  isPending: boolean;
  requestError: unknown;
  onClose: () => void;
  onSubmit: (payload: EmployeeRequest) => void;
}

interface EmployeeFormState {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  dateOfJoining: string;
  salary: string;
  status: EmployeeRequest['status'];
  departmentId: string;
}

const today = new Date().toISOString().slice(0, 10);

const emptyForm: EmployeeFormState = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  designation: '',
  dateOfJoining: today,
  salary: '',
  status: 'ACTIVE',
  departmentId: '',
};

const fieldClass = 'field';

const createInitialForm = (employee: ApiEmployee | null, departments: DepartmentRecord[]): EmployeeFormState => {
  if (!employee) {
    const activeDepartment = departments.find((department) => department.status === 'ACTIVE');
    return { ...emptyForm, dateOfJoining: today, departmentId: activeDepartment ? String(activeDepartment.id) : '' };
  }

  return {
    employeeCode: employee.employeeCode,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone ?? '',
    designation: employee.designation,
    dateOfJoining: employee.dateOfJoining,
    salary: String(employee.salary),
    status: employee.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    departmentId: String(employee.departmentId),
  };
};

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  employee,
  departments,
  isPending,
  requestError,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<EmployeeFormState>(() => createInitialForm(employee, departments));

  const updateField = (field: keyof EmployeeFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      phone: form.phone.trim() || null,
      salary: Number(form.salary),
      departmentId: Number(form.departmentId),
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center modal-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="employee-form-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto modal-panel bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b border-(--border-color) bg-white px-6 py-4">
          <h2 id="employee-form-title" className="text-lg font-semibold text-(--text-main)">
            {employee ? 'Edit employee' : 'Add employee'}
          </h2>
          <button type="button" onClick={onClose} disabled={isPending} aria-label="Close" className="rounded-lg p-2 text-(--text-muted) transition-colors hover:bg-(--bg-subtle) hover:text-(--text-main)">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {requestError != null && (
            <div role="alert" className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {getApiErrorMessage(requestError, 'Could not save this employee.')}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="employee-code">Employee code *</Label>
              <Input id="employee-code" required value={form.employeeCode} onChange={(event) => updateField('employeeCode', event.target.value)} disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-email">Email *</Label>
              <Input id="employee-email" type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-first-name">First name *</Label>
              <Input id="employee-first-name" required value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-last-name">Last name *</Label>
              <Input id="employee-last-name" required value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-phone">Phone</Label>
              <Input id="employee-phone" type="tel" pattern="\+?[0-9]{10,15}" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-designation">Designation *</Label>
              <Input id="employee-designation" required value={form.designation} onChange={(event) => updateField('designation', event.target.value)} disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-department">Department *</Label>
              <select id="employee-department" className={fieldClass} required value={form.departmentId} onChange={(event) => updateField('departmentId', event.target.value)} disabled={isPending || departments.length === 0}>
                <option value="" disabled>Select department</option>
                {departments.filter((department) => department.status === 'ACTIVE' || department.id === Number(form.departmentId)).map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-status">Status *</Label>
              <select id="employee-status" className={fieldClass} value={form.status} onChange={(event) => updateField('status', event.target.value)} disabled={isPending}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-joining-date">Date of joining *</Label>
              <Input id="employee-joining-date" type="date" required max={today} value={form.dateOfJoining} onChange={(event) => updateField('dateOfJoining', event.target.value)} disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employee-salary">Salary *</Label>
              <Input id="employee-salary" type="number" min="0.01" step="0.01" required value={form.salary} onChange={(event) => updateField('salary', event.target.value)} disabled={isPending} />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-(--border-color) pt-4">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isPending}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isPending || departments.length === 0}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {employee ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;