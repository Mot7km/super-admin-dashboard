import { X } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';

type AddCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  onCategoryNameChange: (val: string) => void;
  onSave: () => void;
};

const AddCategoryModal = ({
  isOpen,
  onClose,
  categoryName,
  onCategoryNameChange,
  onSave,
}: AddCategoryModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
          <h3 className="font-bold text-base text-[var(--text-primary)]">{t('menu.categories.add')}</h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">{t('menu.categories.name')}</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => onCategoryNameChange(e.target.value)}
            placeholder="e.g. Appetizers, Seafood, Hot Drinks..."
            className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
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

export default AddCategoryModal;