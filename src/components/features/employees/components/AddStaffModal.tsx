import { useTranslation } from '../../../../../app/context/LanguageContext';
import { X } from 'lucide-react';

type AddStaffModalProps = {
  staffName: string;
  staffRole: string;
  staffBranch: string;
  onChangeName: (value: string) => void;
  onChangeRole: (value: string) => void;
  onChangeBranch: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

const AddStaffModal = ({
  staffName,
  staffRole,
  staffBranch,
  onChangeName,
  onChangeRole,
  onChangeBranch,
  onClose,
  onSave,
}: AddStaffModalProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
          <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
            {t('employees.addStaffModalTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 -mr-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-semibold text-[var(--text-secondary)] block mb-1">
              {t('employees.form.name')}
            </label>
            <input
              value={staffName}
              onChange={(e) => onChangeName(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3 sm:p-2.5 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition"
              placeholder={t('employees.form.namePlaceholder') || 'Enter staff name'}
            />
          </div>

          <div>
            <label className="font-semibold text-[var(--text-secondary)] block mb-1">
              {t('employees.form.role')}
            </label>
            <select
              value={staffRole}
              onChange={(e) => onChangeRole(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3 sm:p-2.5 text-sm font-medium text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition appearance-none"
            >
              <option>Cashier</option>
              <option>Branch Manager</option>
              <option>Kitchen Chef</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-[var(--text-secondary)] block mb-1">
              {t('employees.form.branch')}
            </label>
            <select
              value={staffBranch}
              onChange={(e) => onChangeBranch(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3 sm:p-2.5 text-sm font-medium text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition appearance-none"
            >
              <option>Main Branch</option>
              <option>Mall Branch</option>
              <option>Downtown Branch</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-[var(--color-border)] bg-[var(--surface)] px-4 py-3 sm:py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--elevated)] cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onSave}
            className="w-full sm:w-auto rounded-xl bg-[var(--primary)] px-4 py-3 sm:py-2 text-sm font-semibold text-white shadow transition hover:bg-[var(--primary-dark)] cursor-pointer"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;