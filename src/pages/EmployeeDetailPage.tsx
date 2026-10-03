import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Briefcase, Building2, BadgeCheck, CalendarDays, Mail, Hash, Phone, UserRound, Wallet, KeyRound } from 'lucide-react';
import { employeeApi } from '@/api/employeeApi';
import { changePassword, getStoredUser } from '@/services/authService';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { QueryState } from '@/components/common/QueryState';

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

interface EmployeeDetailPageProps {
  isMyProfile?: boolean;
}

export const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({ isMyProfile = false }) => {
  const { id } = useParams<{ id: string }>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const currentUserEmail = isMyProfile ? getStoredUser()?.email : undefined;
  const { data: employee, isLoading, isError, error, refetch } = useQuery({
    queryKey: isMyProfile ? ['employee', 'me', currentUserEmail] : ['employee', id],
    queryFn: () => isMyProfile ? employeeApi.getMyEmployee() : employeeApi.getEmployeeById(id ?? ''),
    enabled: isMyProfile || Boolean(id),
    retry: false,
  });

  const formatDate = (value: string): string => {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
  };

  const formatSalary = (value: number): string =>
    Number.isFinite(value) ? value.toLocaleString() : '—';

  const submitPasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Your password has been changed.');
    } catch {
      setPasswordError('Password change failed. Check your current password and try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Navigation Breadcrumb / Back Button */}
      {!isMyProfile && <Link
        to="/dashboard"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-(--text-muted) transition-colors hover:text-(--primary)"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>}

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && !employee}
        emptyTitle={isMyProfile ? 'Employee profile not found' : 'Employee not found'}
        emptyDescription={isMyProfile ? 'No employee profile is linked to this account.' : `No employee record was found with ID #${id}.`}
        onRetry={() => void refetch()}
      >
        {employee && (
          <>
            <section className="card mb-6 overflow-hidden">
              <div className="relative h-28 bg-(image:--primary-gradient)">
                <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-16 right-48 h-32 w-32 rounded-full bg-white/10" />
              </div>
              <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
                <InitialsAvatar name={employee.name} size="lg" className="relative z-10 -mt-12 shadow-lg ring-4" />
                <div className="min-w-0 flex-1 sm:pb-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight text-(--text-main)">{employee.name}</h1>
                    <StatusBadge status={employee.status} />
                  </div>
                  <p className="mt-1 text-sm text-(--text-muted)">{employee.designation} · {employee.department}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-(--primary-soft) px-3 py-2 text-sm font-semibold text-(--primary)">
                  <Hash className="h-4 w-4" />{employee.employeeCode}
                </span>
              </div>
            </section>

            <div className="stagger grid grid-cols-1 gap-5 md:grid-cols-2">
              <section className="card card-hover p-6">
                <h2 className="mb-5 text-base font-semibold text-(--text-main)">Work information</h2>
                <dl className="space-y-4">
                  <InfoRow icon={Building2} label="Department">{employee.department}</InfoRow>
                  <InfoRow icon={Briefcase} label="Designation">{employee.designation}</InfoRow>
                  <InfoRow icon={BadgeCheck} label="Status">{employee.status}</InfoRow>
                  <InfoRow icon={CalendarDays} label="Date of joining">{formatDate(employee.dateOfJoining)}</InfoRow>
                  <InfoRow icon={Wallet} label="Salary">{formatSalary(employee.salary)}</InfoRow>
                </dl>
              </section>

              <section className="card card-hover p-6">
                <h2 className="mb-5 text-base font-semibold text-(--text-main)">Contact information</h2>
                <dl className="space-y-4">
                  <InfoRow icon={UserRound} label="Employee name">{employee.name}</InfoRow>
                  <InfoRow icon={Mail} label="Email address">
                    <a href={`mailto:${employee.email}`} className="text-(--primary) hover:underline">{employee.email}</a>
                  </InfoRow>
                  <InfoRow icon={Phone} label="Phone number">{employee.phone || '—'}</InfoRow>
                  <InfoRow icon={Hash} label="System ID"><span className="font-mono">{employee.id}</span></InfoRow>
                </dl>
              </section>
            </div>

            {isMyProfile && (
              <section className="card mt-5 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--primary-soft) text-(--primary)">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-semibold text-(--text-main)">Change password</h2>
                </div>
                <form onSubmit={submitPasswordChange} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-(--text-main) sm:col-span-2">
                    Current password
                    <input
                      type="password"
                      autoComplete="current-password"
                      required
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      disabled={isChangingPassword}
                      className="field mt-1"
                    />
                  </label>
                  <label className="text-sm font-medium text-(--text-main)">
                    New password
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      disabled={isChangingPassword}
                      className="field mt-1"
                    />
                  </label>
                  <label className="text-sm font-medium text-(--text-main)">
                    Confirm new password
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      disabled={isChangingPassword}
                      className="field mt-1"
                    />
                  </label>
                  {passwordError && <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{passwordError}</p>}
                  {passwordSuccess && <p role="status" className="text-sm text-emerald-700 sm:col-span-2">{passwordSuccess}</p>}
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={isChangingPassword} className="btn btn-primary">
                      {isChangingPassword ? 'Changing password…' : 'Change password'}
                    </button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}
      </QueryState>
    </div>
  );
};

export default EmployeeDetailPage;
