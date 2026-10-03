import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastContext, type ToastApi, type ToastItem, type ToastOptions, type ToastVariant } from './toastContext';

const VARIANT_STYLES: Record<ToastVariant, { icon: React.ElementType; iconClass: string; barClass: string }> = {
  success: { icon: CheckCircle2, iconClass: 'bg-(--success-soft) text-(--success)', barClass: 'bg-(--success)' },
  error: { icon: AlertCircle, iconClass: 'bg-(--danger-soft) text-(--danger)', barClass: 'bg-(--danger)' },
  info: { icon: Info, iconClass: 'bg-(--primary-soft) text-(--primary)', barClass: 'bg-(--primary)' },
};

const DEFAULT_DURATION_MS = 4000;
const MAX_VISIBLE = 4;

// Renders app-wide toast notifications in the top-right corner
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((options: ToastOptions) => {
    const toast: ToastItem = {
      id: nextId.current++,
      title: options.title,
      description: options.description,
      variant: options.variant ?? 'info',
      durationMs: options.durationMs ?? DEFAULT_DURATION_MS,
    };
    setToasts((current) => [...current, toast].slice(-MAX_VISIBLE));
    window.setTimeout(() => dismiss(toast.id), toast.durationMs);
  }, [dismiss]);

  const api = useMemo<ToastApi>(() => ({
    show,
    success: (title, description) => show({ title, description, variant: 'success' }),
    error: (title, description) => show({ title, description, variant: 'error', durationMs: 6000 }),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed top-20 right-4 left-4 z-[1200] flex flex-col items-end gap-3 sm:left-auto"
      >
        {toasts.map((toast) => {
          const { icon: Icon, iconClass, barClass } = VARIANT_STYLES[toast.variant];
          return (
            <div
              key={toast.id}
              role={toast.variant === 'error' ? 'alert' : 'status'}
              className="toast-enter pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border border-(--border-color) bg-white shadow-(--shadow-md)"
            >
              <div className="flex items-start gap-3 p-4 pr-10">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-(--text-main)">{toast.title}</p>
                  {toast.description && <p className="mt-0.5 text-sm text-(--text-muted)">{toast.description}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="absolute top-3 right-3 rounded-md p-1 text-(--text-light) transition-colors hover:bg-(--bg-subtle) hover:text-(--text-main)"
              >
                <X className="h-4 w-4" />
              </button>
              {/* Countdown bar */}
              <span
                className={`toast-progress absolute bottom-0 left-0 h-0.5 w-full origin-left ${barClass}`}
                style={{ animationDuration: `${toast.durationMs}ms` }}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
