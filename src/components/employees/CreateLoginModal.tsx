import React, { useState } from 'react';
import { AlertCircle, Loader2, UserPlus, X } from 'lucide-react';
import type { ApiEmployee } from '@/api/employeeApi';
import { getApiErrorMessage } from '@/api/axiosInstance';
import type { CreateLoginRequest } from '@/services/authService';

interface CreateLoginModalProps {
  employees: ApiEmployee[];
  employeesLoading: boolean;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onSubmit: (account: CreateLoginRequest) => void;
}

export const CreateLoginModal: React.FC<CreateLoginModalProps> = ({
  employees,
  employeesLoading,
  isPending,
  error,
  onClose,
  onSubmit,
}) => {
  const [accountType, setAccountType] = useState<'EMPLOYEE' | 'HR'>('EMPLOYEE');
  const [employeeId, setEmployeeId] = useState('');
  const [hrName, setHrName] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [password, setPassword] = useState('');
  const selectedEmployee = employees.find((employee) => employee.id === employeeId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const account = accountType === 'EMPLOYEE'
      ? selectedEmployee && { name: selectedEmployee.name, email: selectedEmployee.email }
      : { name: hrName.trim(), email: hrEmail.trim() };

    if (!account) return;
    onSubmit({ ...account, password, roles: [accountType] });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center modal-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="create-login-title">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto modal-panel bg-white">
        <div className="flex items-center justify-between border-b border-(--border-color) px-5 py-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-(--primary)" />
            <h2 id="create-login-title" className="text-lg font-semibold text-(--text-main)">Create login</h2>
          </div>
          <button type="button" onClick={onClose} disabled={isPending} aria-label="Close" className="rounded-lg p-2 text-(--text-muted) transition-colors hover:bg-(--bg-subtle) hover:text-(--text-main)">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error != null && (
            <div role="alert" className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {getApiErrorMessage(error, 'Could not create this login account.')}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="login-account-type" className="text-sm font-medium text-(--text-main)">Account type</label>
            <select id="login-account-type" value={accountType} onChange={(event) => setAccountType(event.target.value as 'EMPLOYEE' | 'HR')} disabled={isPending} className="field">
              <option value="EMPLOYEE">Employee</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {accountType === 'EMPLOYEE' ? (
            <div className="space-y-1.5">
              <label htmlFor="login-employee" className="text-sm font-medium text-(--text-main)">Employee *</label>
              <select id="login-employee" required value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} disabled={isPending || employeesLoading || employees.length === 0} className="field">
                <option value="" disabled>Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name} ({employee.email})</option>
                ))}
              </select>
              {employeesLoading ? <p className="text-xs text-(--text-muted)">Loading employees...</p> : employees.length === 0 && <p className="text-xs text-rose-700">Add an employee record before creating its login.</p>}
              {selectedEmployee && <p className="text-xs text-(--text-muted)">The login email will match this employee record.</p>}
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label htmlFor="login-hr-name" className="text-sm font-medium text-(--text-main)">Full name *</label>
                <input id="login-hr-name" required value={hrName} onChange={(event) => setHrName(event.target.value)} disabled={isPending} className="field" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="login-hr-email" className="text-sm font-medium text-(--text-main)">Email address *</label>
                <input id="login-hr-email" type="email" required value={hrEmail} onChange={(event) => setHrEmail(event.target.value)} disabled={isPending} className="field" />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label htmlFor="login-initial-password" className="text-sm font-medium text-(--text-main)">Initial password *</label>
            <input id="login-initial-password" type="password" minLength={6} autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} disabled={isPending} className="field" />
            <p className="text-xs text-(--text-muted)">Must be at least 6 characters.</p>
          </div>

          <div className="flex justify-end gap-2 border-t border-(--border-color) pt-4">
            <button type="button" onClick={onClose} disabled={isPending} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending || (accountType === 'EMPLOYEE' && !selectedEmployee)} className="btn btn-primary">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLoginModal;