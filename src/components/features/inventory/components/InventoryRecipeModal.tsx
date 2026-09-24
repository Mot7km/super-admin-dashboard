import { useTranslation } from '../../../../../app/context/LanguageContext';
import { X } from 'lucide-react';

type InventoryRecipeModalProps = {
  selectedRecipeDish: string;
  onChangeDish: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

const InventoryRecipeModal = ({
  selectedRecipeDish,
  onChangeDish,
  onClose,
  onSave,
}: InventoryRecipeModalProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
          <h3 className="font-bold text-sm text-[var(--text-primary)]">{t('inventory.linkRecipe')}</h3>
          <button onClick={onClose} className="cursor-pointer">
            <X className="h-5 w-5 text-[var(--text-muted)]" />
          </button>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-[var(--text-secondary)]">{t('inventory.recipeDishLabel')}</label>
            <select
              value={selectedRecipeDish}
              onChange={(e) => onChangeDish(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 font-medium focus:outline-none cursor-pointer"
            >
              <option value="Smoked Truffle Burger">Smoked Truffle Burger</option>
              <option value="Spanish Iced Latte">Spanish Iced Latte</option>
              <option value="Neapolitan Margherita">Neapolitan Margherita</option>
            </select>
          </div>
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

export default InventoryRecipeModal;
