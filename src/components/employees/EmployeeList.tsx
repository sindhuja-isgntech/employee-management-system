/*import React from 'react';
import type { Employee } from '../types/employee';

interface EmployeeListProps {
  employees: Employee[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
  const getBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'active';
      case 'onboarding':
        return 'onboarding';
      default:
        return 'on-leave';
    }
  };

  return (
    <section className="recent-section">
      <div className="section-header">
        <h3>All Records</h3>
        <div className="search-form">
          <input
            type="search"
            placeholder="Search by name, role, or dept..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search employees"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Employee</th>
              <th scope="col">ID</th>
              <th scope="col">Department</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="employee-cell">
                    <img
                      src={emp.avatarUrl || 'https://via.placeholder.com/28'}
                      alt=""
                      className="avatar-sm"
                    />
                    <span>{emp.name}</span>
                  </td>
                  <td>#EMP-{emp.id}</td>
                  <td>{emp.dept}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span className={`status-badge ${getBadgeClass(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => onEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => onDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EmployeeList;*/


// Employee management screen
import React, { useState } from 'react';
import { AlertCircle, Pencil, Plus, RefreshCw, Trash2, Users, UserPlus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { employeeApi, type ApiEmployee, type EmployeeRequest } from '@/api/employeeApi';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/toast/toastContext';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { PaginationControls } from '@/components/common/PaginationControls';
import { EmployeeFormModal } from '@/components/employees/EmployeeFormModal';
import { CreateLoginModal } from '@/components/employees/CreateLoginModal';
import { getDepartments } from '@/services/hrmsDataService';
import { createLoginAccount, getStoredRoles, hasAnyRole } from '@/services/authService';

export const EmployeeList: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<ApiEmployee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<ApiEmployee | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const toast = useToast();
  const canCreateLogins = hasAnyRole(getStoredRoles(), ['ADMIN']);
  const {
    data: employeePage = { content: [], totalElements: 0, totalPages: 0, number: 0, size: pageSize },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['employees', page, pageSize],
    queryFn: () => employeeApi.getEmployeesPage(page, pageSize),
  });
  const employees = employeePage.content;
  const employeesPickerQuery = useQuery({
    queryKey: ['employees-picker'],
    queryFn: employeeApi.getEmployees,
    enabled: loginFormOpen,
  });
  const departmentsQuery = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: EmployeeRequest }) =>
      id ? employeeApi.updateEmployee(id, payload) : employeeApi.createEmployee(payload),
    onSuccess: async (_saved, { id, payload }) => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
      await queryClient.invalidateQueries({ queryKey: ['employees-picker'] });
      setFormOpen(false);
      setEmployeeToEdit(null);
      const fullName = `${payload.firstName} ${payload.lastName}`.trim();
      if (id) {
        toast.success('Employee updated', `${fullName}'s details were saved successfully.`);
      } else {
        setPage(0);
        toast.success('Employee created', `${fullName} was added to the employee directory.`);
      }
    },
  });
  const deleteMutation = useMutation({
    mutationFn: employeeApi.deleteEmployee,
    onSuccess: async () => {
      const deletedName = employeeToDelete?.name;
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
      await queryClient.invalidateQueries({ queryKey: ['employees-picker'] });
      const remainingPages = Math.ceil(Math.max(0, employeePage.totalElements - 1) / pageSize);
      if (page >= remainingPages) setPage(Math.max(remainingPages - 1, 0));
      setEmployeeToDelete(null);
      toast.success('Employee deleted', deletedName ? `${deletedName}'s record was removed.` : 'The employee record was removed.');
    },
  });
  const loginMutation = useMutation({
    mutationFn: createLoginAccount,
    onSuccess: (_result, account) => {
      setLoginFormOpen(false);
      toast.success('Login created', `${account.email} can now sign in.`);
    },
  });

  const openCreateForm = () => {
    saveMutation.reset();
    setEmployeeToEdit(null);
    setFormOpen(true);
  };

  const openEditForm = (employee: ApiEmployee) => {
    saveMutation.reset();
    setEmployeeToEdit(employee);
    setFormOpen(true);
  };

  const handleSave = (payload: EmployeeRequest) => {
    saveMutation.mutate({ id: employeeToEdit?.id ?? null, payload });
  };

  const requestError = error || departmentsQuery.error || saveMutation.error || deleteMutation.error;

  return (
    <section>
      <PageHeader
        title="Employees"
        subtitle="Create, update, and manage employee records."
        actions={(
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-(--primary-soft) px-3 py-1.5 text-sm font-semibold text-(--primary)">
              <Users className="h-4 w-4" />
              {employeePage.totalElements} employees
            </span>
            {canCreateLogins && (
              <button type="button" onClick={() => { loginMutation.reset(); setLoginFormOpen(true); }} className="btn btn-secondary">
                <UserPlus className="h-4 w-4" />
                Create login
              </button>
            )}
            <button type="button" onClick={openCreateForm} className="btn btn-primary" disabled={departmentsQuery.isLoading || departmentsQuery.isError}>
              <Plus className="h-4 w-4" />
              Add employee
            </button>
          </div>
        )}
      />

      {requestError && (
        <div role="alert" className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{getApiErrorMessage(requestError, 'Could not complete the employee request.')}</span>
          <button type="button" onClick={() => { void refetch(); void departmentsQuery.refetch(); }} className="inline-flex shrink-0 items-center gap-1.5 font-semibold hover:underline">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      <div className="table-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-5 py-3">Employee</th>
              <th className="px-5 py-3">Employee code</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Designation</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="stagger-rows divide-y divide-(--border-color)">
            {isLoading ? (
              Array.from({ length: 5 }, (_, row) => (
                <tr key={`skeleton-${row}`} aria-hidden="true">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="skeleton h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-3.5 w-32" />
                        <div className="skeleton h-3 w-44" />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><div className="skeleton h-3.5 w-20" /></td>
                  <td className="px-5 py-4"><div className="skeleton h-3.5 w-24" /></td>
                  <td className="px-5 py-4"><div className="skeleton h-3.5 w-28" /></td>
                  <td className="px-5 py-4"><div className="skeleton h-6 w-16 rounded-full" /></td>
                  <td className="px-5 py-4"><div className="skeleton ml-auto h-8 w-36" /></td>
                </tr>
              ))
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-40 text-center">
                  <p className="font-medium text-(--text-main)">No employees found</p>
                  <p className="mt-1 text-sm text-(--text-muted)">Employee records will appear here when added.</p>
                </td>
              </tr>
            ) : employees.map((employee) => (
              <tr key={employee.id} className="table-row">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={employee.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-(--text-main)">{employee.name}</p>
                      <p className="truncate text-xs text-(--text-muted)">{employee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-(--text-muted)">{employee.employeeCode}</td>
                <td className="px-5 py-4 text-(--text-main)">{employee.department}</td>
                <td className="px-5 py-4 text-(--text-main)">{employee.designation}</td>
                <td className="px-5 py-4">
                  <span className={`pill ${
                    employee.status === 'Active' ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button type="button" onClick={() => openEditForm(employee)} title={`Edit ${employee.name}`} aria-label={`Edit ${employee.name}`} className="inline-flex items-center gap-2 rounded-md border border-(--border-color) px-3 py-2 text-xs font-semibold text-(--text-main) transition-colors hover:border-(--primary)/40 hover:bg-(--primary-soft) hover:text-(--primary)">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button type="button" onClick={() => { deleteMutation.reset(); setEmployeeToDelete(employee); }} disabled={deleteMutation.isPending} title={`Delete ${employee.name}`} aria-label={`Delete ${employee.name}`} className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls
          page={page}
          pageSize={pageSize}
          totalElements={employeePage.totalElements}
          totalPages={employeePage.totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
        />
      </div>

      {formOpen && (
        <EmployeeFormModal
          key={employeeToEdit?.id ?? 'new'}
          employee={employeeToEdit}
          departments={departmentsQuery.data ?? []}
          isPending={saveMutation.isPending}
          requestError={saveMutation.error}
          onClose={() => { setFormOpen(false); setEmployeeToEdit(null); }}
          onSubmit={handleSave}
        />
      )}

      {employeeToDelete && (
        <ConfirmDeleteDialog
          itemName={employeeToDelete.name}
          itemType="employee record"
          isPending={deleteMutation.isPending}
          onCancel={() => setEmployeeToDelete(null)}
          onConfirm={() => deleteMutation.mutate(employeeToDelete.id)}
        />
      )}

      {loginFormOpen && canCreateLogins && (
        <CreateLoginModal
          employees={employeesPickerQuery.data ?? []}
          employeesLoading={employeesPickerQuery.isLoading}
          isPending={loginMutation.isPending}
          error={loginMutation.error}
          onClose={() => setLoginFormOpen(false)}
          onSubmit={(account) => loginMutation.mutate(account)}
        />
      )}
    </section>
  );
};

export default EmployeeList;