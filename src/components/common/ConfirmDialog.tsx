import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '../../../app/context/LanguageContext';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const btnBg = variant === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[var(--primary)] hover:bg-[var(--primary-dark)]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${variant === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
          >
            {cancelText || t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition ${btnBg} cursor-pointer`}
          >
            {confirmText || t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;