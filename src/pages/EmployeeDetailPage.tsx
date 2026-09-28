import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, BadgeCheck, Mail, Hash, Loader2, UserX } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--primary-soft) text-(--primary)">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <dt className="text-xs font-medium tracking-wide text-(--text-light) uppercase">{label}</dt>
      <dd className="truncate text-sm font-medium text-(--text-main)">{children}</dd>
    </div>
  </div>
);

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, isLoading } = useEmployees();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-(--border-color) bg-white p-16 text-(--text-muted)">
        <Loader2 className="h-7 w-7 animate-spin text-(--primary)" />
        <p className="text-sm font-medium">Loading employee details...</p>
      </div>
    );
  }

  // Find employee matching the route parameter
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-(--border-color) bg-white p-10 text-center shadow-(--shadow-sm)">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <UserX className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-(--text-main)">Employee Not Found</h2>
        <p className="mt-2 text-sm text-(--text-muted)">
          No employee record was found with ID: <strong className="text-(--text-main)">#{id}</strong>
        </p>
        <button type="button" onClick={() => navigate('/employees')} className="btn btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Employee List
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Navigation Breadcrumb / Back Button */}
      <Link
        to="/employees"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-(--text-muted) transition-colors hover:text-(--primary)"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Employees
      </Link>

      {/* Main Profile Header Card */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-(--border-color) bg-white shadow-(--shadow-sm)">
        <div className="h-28 bg-(image:--primary-gradient)" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <InitialsAvatar name={employee.name} src={employee.avatarUrl} size="lg" className="-mt-12 ring-4" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-(--text-main)">{employee.name}</h1>
              <StatusBadge status={employee.status} />
            </div>
            <p className="mt-1 text-(--text-muted)">{employee.designation || employee.role}</p>
          </div>
          <span className="inline-flex w-fit items-center rounded-lg bg-(--primary-soft) px-3 py-1.5 text-sm font-semibold text-(--primary)">
            Employee ID: #{employee.id}
          </span>
        </div>
      </section>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Work Information Box */}
        <section className="rounded-2xl border border-(--border-color) bg-white p-6 shadow-(--shadow-sm)">
          <h3 className="mb-5 text-base font-semibold text-(--text-main)">Work Information</h3>
          <dl className="space-y-4">
            <InfoRow icon={Building2} label="Department">{employee.dept}</InfoRow>
            <InfoRow icon={Briefcase} label="Role">{employee.role}</InfoRow>
            <InfoRow icon={BadgeCheck} label="Designation">{employee.designation || 'N/A'}</InfoRow>
          </dl>
        </section>

        {/* Contact Information Box */}
        <section className="rounded-2xl border border-(--border-color) bg-white p-6 shadow-(--shadow-sm)">
          <h3 className="mb-5 text-base font-semibold text-(--text-main)">Contact & Identification</h3>
          <dl className="space-y-4">
            <InfoRow icon={Mail} label="Email Address">
              <a href={`mailto:${employee.email}`} className="text-(--primary) hover:underline">
                {employee.email}
              </a>
            </InfoRow>
            <InfoRow icon={Hash} label="System ID">
              <span className="font-mono">{employee.id}</span>
            </InfoRow>
          </dl>
        </section>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
