import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { getApiErrorMessage } from '@/api/axiosInstance';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onRetry: () => void;
  children: React.ReactNode;
}

// Shimmering placeholder shaped like a table while records load
const LoadingSkeleton: React.FC = () => (
  <div className="table-card p-5" role="status" aria-label="Loading records">
    <div className="skeleton mb-5 h-4 w-40" />
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, row) => (
        <div key={row} className="flex items-center gap-4">
          <div className="skeleton h-9 w-9 shrink-0 rounded-full" />
          <div className="skeleton h-3.5 flex-1" />
          <div className="skeleton hidden h-3.5 w-1/5 sm:block" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
    <span className="sr-only">Loading records...</span>
  </div>
);

export const QueryState: React.FC<QueryStateProps> = ({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyTitle,
  emptyDescription,
  onRetry,
  children,
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="card flex min-h-56 flex-col items-center justify-center gap-3 border-rose-200 bg-rose-50/60 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertCircle className="h-6 w-6" />
        </span>
        <p className="max-w-md text-sm font-medium text-rose-800">{getApiErrorMessage(error, 'Could not load records.')}</p>
        <button type="button" onClick={onRetry} className="btn btn-secondary btn-sm mt-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="card flex min-h-56 flex-col items-center justify-center border-dashed p-8 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary)">
          <Inbox className="h-6 w-6" />
        </span>
        <p className="font-semibold text-(--text-main)">{emptyTitle}</p>
        <p className="mt-1 max-w-sm text-sm text-(--text-muted)">{emptyDescription}</p>
      </div>
    );
  }

  return <>{children}</>;
};
