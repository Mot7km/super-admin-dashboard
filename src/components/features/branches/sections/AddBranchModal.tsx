import { X } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';

type AddBranchModalProps = {
  open: boolean;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  onBranchNameChange: (value: string) => void;
  onBranchAddressChange: (value: string) => void;
  onBranchPhoneChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

const AddBranchModal = ({ open, branchName, branchAddress, branchPhone, onBranchNameChange, onBranchAddressChange, onBranchPhoneChange, onClose, onSave }: AddBranchModalProps) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
          <h3 className="font-bold text-base text-[var(--text-primary)]">{t('branches.addModalTitle')}</h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Branch Name</label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => onBranchNameChange(e.target.value)}
              placeholder="e.g. Nasr City Branch"
              className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Address</label>
            <input
              type="text"
              value={branchAddress}
              onChange={(e) => onBranchAddressChange(e.target.value)}
              placeholder="e.g. Abbas El-Akkad St, Cairo"
              className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Phone Number</label>
            <input
              type="text"
              value={branchPhone}
              onChange={(e) => onBranchPhoneChange(e.target.value)}
              placeholder="e.g. +20 102 345 6789"
              className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onSave}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBranchModal;