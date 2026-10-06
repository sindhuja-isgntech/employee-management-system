import React, { useState } from 'react';
import { AlertCircle, Building2, CheckCircle2, CircleSlash, Loader2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/toast/toastContext';
import { QueryState } from '@/components/common/QueryState';
import { PaginationControls } from '@/components/common/PaginationControls';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { hasAnyRole, getStoredRoles } from '@/services/authService';
import {
  createDepartment,
  deleteDepartment,
  getDepartmentsPage,
  getDepartmentSummary,
  updateDepartment,
  type DepartmentRecord,
  type DepartmentRequest,
} from '@/services/hrmsDataService';

interface DepartmentFormModalProps {
  department: DepartmentRecord | null;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onSubmit: (department: DepartmentRequest) => void;
}

const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
  department,
  isPending,
  error,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(department?.name ?? '');
  const [description, setDescription] = useState(department?.description ?? '');
  const [status, setStatus] = useState<DepartmentRecord['status']>(department?.status ?? 'ACTIVE');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ name: name.trim(), description: description.trim(), status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="department-form-title">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto modal-panel bg-white">
        <div className="flex items-center justify-between border-b border-(--border-color) px-5 py-4">
          <h2 id="department-form-title" className="text-lg font-semibold text-(--text-main)">
            {department ? 'Edit department' : 'Add department'}
          </h2>
          <button type="button" onClick={onClose} disabled={isPending} aria-label="Close" className="rounded-lg p-2 text-(--text-muted) transition-colors hover:bg-(--bg-subtle) hover:text-(--text-main)">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error != null && (
            <div role="alert" className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {getApiErrorMessage(error, 'Could not save this department.')}
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="department-name" className="text-sm font-medium text-(--text-main)">Department name *</label>
            <input id="department-name" autoFocus required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} disabled={isPending} className="field" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="department-description" className="text-sm font-medium text-(--text-main)">Description</label>
            <textarea id="department-description" rows={3} maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} disabled={isPending} className="field resize-y" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="department-status" className="text-sm font-medium text-(--text-main)">Status</label>
            <select id="department-status" value={status} onChange={(event) => setStatus(event.target.value as DepartmentRecord['status'])} disabled={isPending} className="field">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 border-t border-(--border-color) pt-4">
            <button type="button" onClick={onClose} disabled={isPending} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending || !name.trim()} className="btn btn-primary">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {department ? 'Save changes' : 'Add department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const formatDate = (value?: string): string => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

export const DepartmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<DepartmentRecord | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<DepartmentRecord | null>(null);
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DepartmentRecord['status']>('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const canManageDepartments = hasAnyRole(getStoredRoles(), ['ADMIN', 'HR']);
  const {
    data: departmentPage = { content: [], totalElements: 0, totalPages: 0, number: 0, size: pageSize },
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['departments', page, pageSize, departmentSearch, statusFilter],
    queryFn: () => getDepartmentsPage(page, pageSize, departmentSearch, statusFilter === 'ALL' ? undefined : statusFilter),
  });
  const { data: departmentSummary } = useQuery({
    queryKey: ['department-summary'],
    queryFn: getDepartmentSummary,
  });
  const saveMutation = useMutation({
    mutationFn: ({ id, department }: { id: number | null; department: DepartmentRequest }) =>
      id === null ? createDepartment(department) : updateDepartment(id, department),
    onSuccess: async (_saved, { id, department }) => {
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      await queryClient.invalidateQueries({ queryKey: ['department-summary'] });
      setFormOpen(false);
      setDepartmentToEdit(null);
      if (id === null) {
        setPage(0);
        toast.success('Department added', `"${department.name}" was added successfully.`);
      } else {
        toast.success('Department updated', `"${department.name}" was saved successfully.`);
      }
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: async () => {
      const deletedName = departmentToDelete?.name;
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      await queryClient.invalidateQueries({ queryKey: ['department-summary'] });
      const remainingPages = Math.ceil(Math.max(0, departmentPage.totalElements - 1) / pageSize);
      if (page >= remainingPages) setPage(Math.max(remainingPages - 1, 0));
      setDepartmentToDelete(null);
      toast.success('Department deleted', deletedName ? `"${deletedName}" was removed.` : 'The department was removed.');
    },
  });
  const departments = departmentPage.content;
  const mutationError = deleteMutation.error;

  const openCreateForm = () => {
    saveMutation.reset();
    setDepartmentToEdit(null);
    setFormOpen(true);
  };

  const openEditForm = (department: DepartmentRecord) => {
    saveMutation.reset();
    setDepartmentToEdit(department);
    setFormOpen(true);
  };

  const handleSave = (department: DepartmentRequest) => {
    saveMutation.mutate({ id: departmentToEdit?.id ?? null, department });
  };

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Browse and manage your organization’s departments."
        actions={canManageDepartments ? (
          <button type="button" onClick={openCreateForm} className="btn btn-primary">
            <Plus className="h-4 w-4" />
            Add department
          </button>
        ) : undefined}
      />
      <section className="stagger mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Department summary">
        {[
          { label: 'Total departments', value: departmentSummary?.total ?? 0, icon: Building2, tone: 'bg-(--primary-soft) text-(--primary)' },
          { label: 'Active', value: departmentSummary?.active ?? 0, icon: CheckCircle2, tone: 'bg-blue-50 text-blue-600' },
          { label: 'Inactive', value: departmentSummary?.inactive ?? 0, icon: CircleSlash, tone: 'bg-slate-100 text-slate-500' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card card-hover flex items-center gap-4 p-5">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold tracking-tight text-(--text-main)">{isLoading ? '–' : value}</p>
              <p className="text-sm text-(--text-muted)">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {mutationError && (
        <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{getApiErrorMessage(mutationError, 'Could not delete this department.')}</span>
          <button type="button" onClick={() => deleteMutation.reset()} aria-label="Dismiss error" className="rounded p-1 hover:bg-rose-100"><X className="h-4 w-4" /></button>
        </div>
      )}

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && departmentPage.totalElements === 0 && !departmentSearch.trim() && statusFilter === 'ALL'}
        emptyTitle="No departments yet"
        emptyDescription="Departments added to the organization will appear here."
        onRetry={() => void refetch()}
      >
        <div className="table-card">
          <div className="flex flex-wrap items-center justify-end gap-3 border-b border-(--border-color) p-3 sm:px-4">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-light)" />
              <input
                type="search"
                aria-label="Search department names"
                placeholder="Search department name"
                value={departmentSearch}
                onChange={(event) => { setDepartmentSearch(event.target.value); setPage(0); }}
                className="field pl-10"
              />
            </div>
            <select
              aria-label="Filter departments by status"
              value={statusFilter}
              onChange={(event) => { setStatusFilter(event.target.value as typeof statusFilter); setPage(0); }}
              className="field w-full sm:w-44"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
                {canManageDepartments && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="stagger-rows divide-y divide-(--border-color)">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={canManageDepartments ? 5 : 4} className="px-5 py-12 text-center text-sm text-(--text-muted)">
                    No departments match these filters.
                  </td>
                </tr>
              ) : departments.map((department) => (
                <tr key={department.id} className="table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--primary-soft) text-(--primary)">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <span className="font-medium text-(--text-main)">{department.name}</span>
                    </div>
                  </td>
                  <td className="max-w-sm px-5 py-4 text-(--text-muted)">{department.description || '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`pill ${
                      department.status === 'ACTIVE'
                        ? 'bg-blue-50 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {department.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-(--text-muted)">{formatDate(department.createdAt)}</td>
                  {canManageDepartments && (
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button type="button" onClick={() => openEditForm(department)} aria-label={`Edit ${department.name}`} title={`Edit ${department.name}`} className="inline-flex items-center gap-1.5 rounded-md border border-(--border-color) px-3 py-2 text-xs font-semibold text-(--text-main) transition-colors hover:border-(--primary)/40 hover:bg-(--primary-soft) hover:text-(--primary)">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button type="button" onClick={() => { deleteMutation.reset(); setDepartmentToDelete(department); }} disabled={deleteMutation.isPending} aria-label={`Delete ${department.name}`} title={`Delete ${department.name}`} className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <PaginationControls
            page={page}
            pageSize={pageSize}
            totalElements={departmentPage.totalElements}
            totalPages={departmentPage.totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
          />
        </div>
      </QueryState>

      {formOpen && canManageDepartments && (
        <DepartmentFormModal
          key={departmentToEdit?.id ?? 'new'}
          department={departmentToEdit}
          isPending={saveMutation.isPending}
          error={saveMutation.error}
          onClose={() => { setFormOpen(false); setDepartmentToEdit(null); }}
          onSubmit={handleSave}
        />
      )}

      {departmentToDelete && canManageDepartments && (
        <ConfirmDeleteDialog
          itemName={departmentToDelete.name}
          itemType="department"
          description="Employees may need to be reassigned before it can be removed. This action cannot be undone."
          isPending={deleteMutation.isPending}
          onCancel={() => setDepartmentToDelete(null)}
          onConfirm={() => deleteMutation.mutate(departmentToDelete.id)}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;