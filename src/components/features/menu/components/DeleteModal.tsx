import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-[var(--card)] p-6 shadow-2xl sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="mt-3 text-xl font-bold text-[var(--text-primary)]">
            Delete Review
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Are you sure you want to delete this review? This action cannot be undone.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--surface)] py-3 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--color-border-strong)]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};