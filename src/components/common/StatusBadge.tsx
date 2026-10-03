import React from 'react';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  inactive: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  onboarding: 'bg-amber-50 text-amber-700 ring-amber-600/20',
};

const DOT_STYLES: Record<string, string> = {
  active: 'bg-blue-500',
  inactive: 'bg-rose-500',
  onboarding: 'bg-amber-500',
};

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const key = status?.toLowerCase() ?? '';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        STATUS_STYLES[key] ?? 'bg-slate-50 text-slate-600 ring-slate-500/20',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', DOT_STYLES[key] ?? 'bg-slate-400')} />
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
