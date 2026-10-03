import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Loader2, LogIn, LogOut } from 'lucide-react';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/toast/toastContext';
import { QueryState } from '@/components/common/QueryState';
import { getStoredRoles, hasAnyRole } from '@/services/authService';
import { checkInToAttendance, checkOutFromAttendance, getAttendance } from '@/services/hrmsDataService';

const formatDateTime = (value: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const AttendancePage: React.FC = () => {
  const roles = getStoredRoles();
  const isManager = hasAnyRole(roles, ['ADMIN', 'HR']);
  const isEmployee = hasAnyRole(roles, ['EMPLOYEE']) && !isManager;
  const queryClient = useQueryClient();
  const toast = useToast();
  const [date, setDate] = useState('');
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['attendance', isManager, date],
    queryFn: () => getAttendance(isManager, date || undefined),
  });
  const attendanceMutation = useMutation({
    mutationFn: (action: 'check-in' | 'check-out') =>
      action === 'check-in' ? checkInToAttendance() : checkOutFromAttendance(),
    onSuccess: async (record, action) => {
      await queryClient.invalidateQueries({ queryKey: ['attendance', false] });
      if (action === 'check-in') {
        const time = record?.checkIn ? ` at ${formatDateTime(record.checkIn)}` : '';
        toast.success('Checked in successfully', `You checked in${time}. Have a great day!`);
      } else {
        const time = record?.checkOut ? ` at ${formatDateTime(record.checkOut)}` : '';
        const hours = record?.workingHours != null ? ` · ${record.workingHours.toFixed(1)} h worked today` : '';
        toast.success('Checked out successfully', `You checked out${time}${hours}.`);
      }
    },
  });

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayRecord = data.find((record) => record.attendanceDate === today);
  const canCheckIn = isEmployee && !todayRecord;
  const canCheckOut = isEmployee && Boolean(todayRecord?.checkIn) && !todayRecord?.checkOut;

  return (
    <div>
      <PageHeader
        title={isManager ? 'Attendance' : 'My Attendance'}
        subtitle={isManager ? 'Attendance records across the organization.' : 'Your attendance history.'}
        actions={isManager ? (
          <label className="flex items-center gap-2 text-sm text-(--text-muted)">
            <span className="hidden sm:inline">Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-10 rounded-lg border border-(--border-color) bg-white px-3 text-sm text-(--text-main) focus:border-(--primary) focus:outline-none focus:ring-3 focus:ring-blue-600/15"
            />
          </label>
        ) : isEmployee ? (
          <div className="flex flex-wrap items-center gap-3">
            {canCheckIn && (
              <button type="button" onClick={() => attendanceMutation.mutate('check-in')} disabled={attendanceMutation.isPending || isLoading} className="btn btn-primary">
                {attendanceMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Check in
              </button>
            )}
            {canCheckOut && (
              <button type="button" onClick={() => attendanceMutation.mutate('check-out')} disabled={attendanceMutation.isPending} className="btn btn-secondary">
                {attendanceMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                Check out
              </button>
            )}
            {todayRecord?.checkOut && (
              <span className="text-sm font-medium text-(--text-muted)">Today’s attendance is complete</span>
            )}
          </div>
        ) : undefined}
      />

      {attendanceMutation.error && (
        <div role="alert" className="mb-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {getApiErrorMessage(attendanceMutation.error, 'Could not update your attendance.')}
        </div>
      )}

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && data.length === 0}
        emptyTitle="No attendance records"
        emptyDescription={date ? 'There are no records for this date.' : 'Attendance records will appear here once they are available.'}
        onRetry={() => void refetch()}
      >
        <div className="table-card">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-5 py-3">Date</th>
                {isManager && <th className="px-5 py-3">Employee</th>}
                <th className="px-5 py-3">Check in</th>
                <th className="px-5 py-3">Check out</th>
                <th className="px-5 py-3">Hours</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="stagger-rows divide-y divide-(--border-color)">
              {data.map((record) => (
                <tr key={record.id} className="table-row">
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-(--text-main)">
                    {new Date(`${record.attendanceDate}T00:00:00`).toLocaleDateString()}
                  </td>
                  {isManager && <td className="px-5 py-4 text-(--text-main)">{record.employeeName}</td>}
                  <td className="px-5 py-4 text-(--text-muted)">{formatDateTime(record.checkIn)}</td>
                  <td className="px-5 py-4 text-(--text-muted)">{formatDateTime(record.checkOut)}</td>
                  <td className="px-5 py-4 text-(--text-muted)">{record.workingHours != null ? `${record.workingHours.toFixed(1)} h` : '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`pill ${
                      record.status === 'PRESENT'
                        ? 'bg-blue-50 text-blue-800'
                        : record.status === 'HALF_DAY'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </QueryState>
    </div>
  );
};

export default AttendancePage;