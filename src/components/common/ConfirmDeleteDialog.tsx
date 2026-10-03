import React from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  itemName: string;
  itemType: string;
  description?: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  itemName,
  itemType,
  description,
  isPending,
  onCancel,
  onConfirm,
}) => (
  <div className="fixed inset-0 z-[1100] flex items-center justify-center modal-backdrop p-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto modal-panel border border-(--border-color) bg-white p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 id="delete-dialog-title" className="text-base font-semibold text-(--text-main)">
            Delete this {itemType}?
          </h2>
          <p id="delete-dialog-description" className="mt-1 text-sm text-(--text-muted)">
            Are you sure you want to delete <strong className="break-words text-(--text-main)">{itemName}</strong>? {description ?? 'This action cannot be undone.'}
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" autoFocus onClick={onCancel} disabled={isPending} className="btn btn-secondary">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={isPending} className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {isPending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteDialog;