import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  pageSize,
  totalElements,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalElements === 0) return null;

  const firstItem = page * pageSize + 1;
  const lastItem = Math.min((page + 1) * pageSize, totalElements);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border-color) px-4 py-3">
      <p className="text-sm text-(--text-muted)">
        Showing <span className="font-medium text-(--text-main)">{firstItem}-{lastItem}</span> of{' '}
        <span className="font-medium text-(--text-main)">{totalElements}</span>
      </p>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-(--text-muted)">
          <span>Rows</span>
          <select
            aria-label="Rows per page"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="field h-9 w-20 py-1"
          >
            {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <span className="min-w-20 text-center text-sm tabular-nums text-(--text-muted)">
          {page + 1} of {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
          title="Previous page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-(--border-color) text-(--text-main) hover:bg-(--bg-subtle) disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          aria-label="Next page"
          title="Next page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-(--border-color) text-(--text-main) hover:bg-(--bg-subtle) disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};