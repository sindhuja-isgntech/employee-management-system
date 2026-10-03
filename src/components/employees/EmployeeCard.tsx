// src/components/employees/EmployeeCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Mail, Pencil, Power, Trash2, ArrowRight } from 'lucide-react';
import type { Employee } from '@/types/employee';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';

interface EmployeeCardProps {
  employee: Employee;
  onToggleStatus?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  showActions?: boolean;
}

const iconButton =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-(--border-color) bg-white text-(--text-muted) transition-colors';

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onToggleStatus,
  onDelete,
  onEdit,
  showActions = true,
}) => {
  const { name, id, dept, designation, email, status, avatarUrl } = employee;
  const isStatusActive = status === 'Active';

  return (
    <article className="group flex flex-col rounded-xl border border-(--border-color) bg-white shadow-(--shadow-sm) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-md)">
      {/* Identity */}
      <div className="flex items-start gap-3 p-5 pb-4">
        <InitialsAvatar name={name} src={avatarUrl} />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-base font-semibold text-(--text-main)">{name}</h4>
          <span className="text-xs text-(--text-light)">ID #{id}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Details */}
      <dl className="space-y-2 px-5 pb-4 text-sm">
        <div className="flex items-center gap-2 text-(--text-muted)">
          <Briefcase className="h-4 w-4 shrink-0 text-(--text-light)" />
          <dt className="sr-only">Designation</dt>
          <dd className="truncate text-(--text-main)">{designation || '—'}</dd>
        </div>
        <div className="flex items-center gap-2 text-(--text-muted)">
          <Building2 className="h-4 w-4 shrink-0 text-(--text-light)" />
          <dt className="sr-only">Department</dt>
          <dd className="truncate">{dept}</dd>
        </div>
        <div className="flex items-center gap-2 text-(--text-muted)">
          <Mail className="h-4 w-4 shrink-0 text-(--text-light)" />
          <dt className="sr-only">Email</dt>
          <dd className="truncate">{email}</dd>
        </div>
      </dl>

      {/* Actions */}
      <div className="mt-auto flex items-center justify-between gap-2 rounded-b-xl border-t border-(--border-color) bg-(--bg-subtle) px-5 py-3">
        <Link
          to={`/employees/${employee.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-(--primary) hover:text-(--primary-hover)"
        >
          View Profile
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {showActions && onToggleStatus && onDelete && onEdit && <div className="flex items-center gap-1.5">
          {/* Status Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleStatus(id)}
            title={isStatusActive ? 'Deactivate' : 'Activate'}
            aria-label={isStatusActive ? 'Deactivate' : 'Activate'}
            className={`${iconButton} ${isStatusActive ? 'hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600' : 'hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'}`}
          >
            <Power className="h-4 w-4" />
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(id)}
            title="Edit"
            aria-label="Edit"
            className={`${iconButton} hover:border-indigo-200 hover:bg-(--primary-soft) hover:text-(--primary)`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(id)}
            title="Delete"
            aria-label="Delete"
            className={`${iconButton} hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>}
      </div>
    </article>
  );
};

export default EmployeeCard;
