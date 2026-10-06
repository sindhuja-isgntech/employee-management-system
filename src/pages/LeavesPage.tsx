import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Check, CircleX, Loader2, Plus, Search, X } from 'lucide-react';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/toast/toastContext';
import { QueryState } from '@/components/common/QueryState';
import { PaginationControls } from '@/components/common/PaginationControls';
import { getStoredRoles, hasAnyRole } from '@/services/authService';
import { approveLeave, applyForLeave, getLeaves, rejectLeave, type LeaveApplication, type LeaveRecord } from '@/services/hrmsDataService';

interface LeaveApplicationModalProps {
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onSubmit: (application: LeaveApplication) => void;
}

interface RejectLeaveModalProps {
  employeeName: string;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const getToday = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const LeaveApplicationModal: React.FC<LeaveApplicationModalProps> = ({ isPending, error, onClose, onSubmit }) => {
  const [leaveType, setLeaveType] = useState<LeaveRecord['leaveType']>('CASUAL');
  const [startDate, setStartDate] = useState(getToday);
  const [endDate, setEndDate] = useState(getToday);
  const [reason, setReason] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ leaveType, startDate, endDate, reason: reason.trim() });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center modal-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="leave-form-title">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto modal-panel bg-white">
        <div className="flex items-center justify-between border-b border-(--border-color) px-5 py-4">
          <h2 id="leave-form-title" className="text-lg font-semibold text-(--text-main)">Apply for leave</h2>
          <button type="button" onClick={onClose} disabled={isPending} aria-label="Close" className="rounded-lg p-2 text-(--text-muted) transition-colors hover:bg-(--bg-subtle) hover:text-(--text-main)">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error != null && (
            <div role="alert" className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {getApiErrorMessage(error, 'Could not submit your leave request.')}
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="leave-type" className="text-sm font-medium text-(--text-main)">Leave type</label>
            <select id="leave-type" value={leaveType} onChange={(event) => setLeaveType(event.target.value as LeaveRecord['leaveType'])} disabled={isPending} className="field">
              <option value="SICK">Sick</option>
              <option value="CASUAL">Casual</option>
              <option value="EARNED">Earned</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="leave-start-date" className="text-sm font-medium text-(--text-main)">Start date</label>
              <input id="leave-start-date" type="date" required min={getToday()} value={startDate} onChange={(event) => { setStartDate(event.target.value); if (endDate < event.target.value) setEndDate(event.target.value); }} disabled={isPending} className="field" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="leave-end-date" className="text-sm font-medium text-(--text-main)">End date</label>
              <input id="leave-end-date" type="date" required min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} disabled={isPending} className="field" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="leave-reason" className="text-sm font-medium text-(--text-main)">Reason</label>
            <textarea id="leave-reason" required minLength={3} maxLength={500} rows={4} value={reason} onChange={(event) => setReason(event.target.value)} disabled={isPending} className="field resize-y" />
          </div>
          <div className="flex justify-end gap-2 border-t border-(--border-color) pt-4">
            <button type="button" onClick={onClose} disabled={isPending} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending || !reason.trim() || endDate < startDate} className="btn btn-primary">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RejectLeaveModal: React.FC<RejectLeaveModalProps> = ({ employeeName, isPending, error, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center modal-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="reject-leave-title">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto modal-panel bg-white">
        <div className="flex items-center justify-between border-b border-(--border-color) px-5 py-4">
          <h2 id="reject-leave-title" className="text-lg font-semibold text-(--text-main)">Reject leave request</h2>
          <button type="button" onClick={onClose} disabled={isPending} aria-label="Close" className="rounded-lg p-2 text-(--text-muted) transition-colors hover:bg-(--bg-subtle) hover:text-(--text-main)">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <p className="text-sm text-(--text-muted)">
            Reject <span className="font-semibold text-(--text-main)">{employeeName}</span>&apos;s leave request? You may include a reason for the employee.
          </p>
          {error != null && (
            <div role="alert" className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {getApiErrorMessage(error, 'Could not reject this leave request.')}
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="leave-rejection-reason" className="text-sm font-medium text-(--text-main)">Rejection reason</label>
            <textarea id="leave-rejection-reason" maxLength={500} rows={3} value={reason} onChange={(event) => setReason(event.target.value)} disabled={isPending} className="field resize-y" />
          </div>
          <div className="flex justify-end gap-2 border-t border-(--border-color) pt-4">
            <button type="button" onClick={onClose} disabled={isPending} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleX className="h-4 w-4" />}
              Reject request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const formatDate = (value: string): string => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const statusClass = (status: string): string => {
  switch (status) {
    case 'APPROVED': return 'bg-blue-50 text-blue-800';
    case 'PENDING': return 'bg-amber-50 text-amber-800';
    case 'REJECTED': return 'bg-rose-50 text-rose-800';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export const LeavesPage: React.FC = () => {
  const roles = getStoredRoles();
  const isManager = hasAnyRole(roles, ['ADMIN', 'HR']);
  const isEmployee = hasAnyRole(roles, ['EMPLOYEE']) && !isManager;
  const queryClient = useQueryClient();
  const toast = useToast();
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [leaveToReject, setLeaveToReject] = useState<LeaveRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const {
    data: leavePage = { content: [], totalElements: 0, totalPages: 0, number: 0, size: pageSize },
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['leaves', isManager, page, pageSize, searchTerm],
    queryFn: () => getLeaves(isManager, page, pageSize, searchTerm.trim()),
  });
  const applicationMutation = useMutation({
    mutationFn: applyForLeave,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['leaves', false] });
      setApplicationOpen(false);
      toast.success('Leave request submitted', 'Your request has been sent for approval.');
    },
  });
  const reviewMutation = useMutation({
    mutationFn: ({ id, decision, reason }: { id: number; decision: 'approve' | 'reject'; reason?: string }) =>
      decision === 'approve' ? approveLeave(id) : rejectLeave(id, reason),
    onSuccess: async (_leave, { id, decision }) => {
      const employeeName = leavePage.content.find((leave) => leave.id === id)?.employeeName;
      const whose = employeeName ? `${employeeName}'s` : 'The';
      await queryClient.invalidateQueries({ queryKey: ['leaves', true] });
      setLeaveToReject(null);
      if (decision === 'approve') {
        toast.success('Leave approved', `${whose} leave request was approved.`);
      } else {
        toast.success('Leave rejected', `${whose} leave request was rejected.`);
      }
    },
  });
  const leaves = leavePage.content;

  return (
    <div>
      <PageHeader
        title={isManager ? 'Leave Requests' : 'My Leave Requests'}
        subtitle={isManager ? 'Review leave requests across the organization.' : 'Track your submitted leave requests.'}
        actions={isEmployee ? (
          <button type="button" onClick={() => { applicationMutation.reset(); setApplicationOpen(true); }} className="btn btn-primary">
            <Plus className="h-4 w-4" />
            Apply for leave
          </button>
        ) : isManager && reviewMutation.error ? (
          <span role="alert" className="flex items-center gap-2 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {getApiErrorMessage(reviewMutation.error, 'Could not update the leave request.')}
          </span>
        ) : undefined}
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && leavePage.totalElements === 0 && !searchTerm.trim()}
        emptyTitle="No leave requests"
        emptyDescription="Leave requests will appear here once they have been submitted."
        onRetry={() => void refetch()}
      >
        <div className="table-card">
          <div className="flex justify-end border-b border-(--border-color) p-3 sm:px-4">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-light)" />
              <input
                type="search"
                aria-label="Search leave requests"
                placeholder="Search employee, type, status, or reason"
                value={searchTerm}
                onChange={(event) => { setSearchTerm(event.target.value); setPage(0); }}
                className="field pl-10 pr-10"
              />
              {searchTerm && (
                <button type="button" onClick={() => { setSearchTerm(''); setPage(0); }} aria-label="Clear leave search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-(--text-muted) hover:bg-(--bg-subtle) hover:text-(--text-main)">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <table className={`w-full ${isManager ? 'min-w-[1000px]' : 'min-w-[760px]'} text-left text-sm`}>
            <thead className="table-head">
              <tr>
                {isManager && <th className="px-5 py-3">Employee</th>}
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Dates</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                {isManager && <th className="px-5 py-3">Reviewed by</th>}
                {isManager && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="stagger-rows divide-y divide-(--border-color)">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={isManager ? 7 : 4} className="px-5 py-12 text-center text-sm text-(--text-muted)">
                    No leave requests match “{searchTerm}”.
                  </td>
                </tr>
              ) : leaves.map((leave) => (
                <tr key={leave.id} className="table-row">
                  {isManager && <td className="whitespace-nowrap px-5 py-4 font-medium text-(--text-main)">{leave.employeeName}</td>}
                  <td className="px-5 py-4 text-(--text-main)">{leave.leaveType}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-(--text-muted)">
                    {formatDate(leave.startDate)} <span className="px-1 text-(--text-light)">to</span> {formatDate(leave.endDate)}
                  </td>
                  <td className="max-w-sm px-5 py-4 text-(--text-muted)">
                    <span className="block truncate" title={leave.reason}>{leave.reason}</span>
                    {leave.status === 'REJECTED' && leave.rejectionReason && (
                      <span className="mt-1 block truncate text-xs text-rose-700" title={leave.rejectionReason}>
                        {leave.rejectionReason}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`pill ${statusClass(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  {isManager && <td className="px-5 py-4 text-(--text-muted)">{leave.approvedByName || '—'}</td>}
                  {isManager && (
                    <td className="px-5 py-4 text-right">
                      {leave.status === 'PENDING' ? (
                        <div className="inline-flex items-center gap-2">
                          <button type="button" onClick={() => reviewMutation.mutate({ id: leave.id, decision: 'approve' })} disabled={reviewMutation.isPending} className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:opacity-60">
                            {reviewMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                            Approve
                          </button>
                          <button type="button" onClick={() => { reviewMutation.reset(); setLeaveToReject(leave); }} disabled={reviewMutation.isPending} className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60">
                            <CircleX className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      ) : <span className="text-(--text-light)">—</span>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <PaginationControls
            page={page}
            pageSize={pageSize}
            totalElements={leavePage.totalElements}
            totalPages={leavePage.totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
          />
        </div>
      </QueryState>

      {applicationOpen && isEmployee && (
        <LeaveApplicationModal
          isPending={applicationMutation.isPending}
          error={applicationMutation.error}
          onClose={() => setApplicationOpen(false)}
          onSubmit={(application) => applicationMutation.mutate(application)}
        />
      )}

      {leaveToReject && isManager && (
        <RejectLeaveModal
          key={leaveToReject.id}
          employeeName={leaveToReject.employeeName}
          isPending={reviewMutation.isPending}
          error={reviewMutation.error}
          onClose={() => setLeaveToReject(null)}
          onSubmit={(reason) => reviewMutation.mutate({ id: leaveToReject.id, decision: 'reject', reason })}
        />
      )}
    </div>
  );
};

export default LeavesPage;