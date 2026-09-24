import { X, Check } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { MenuProduct } from '../menu.types';

type VariantBuilderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDish: MenuProduct | null;
  newVariantInput: string;
  onVariantInputChange: (val: string) => void;
  onAddVariant: () => void;
  newExtraInput: string;
  onExtraInputChange: (val: string) => void;
  onAddExtra: () => void;
};

const VariantBuilderModal = ({
  isOpen,
  onClose,
  selectedDish,
  newVariantInput,
  onVariantInputChange,
  onAddVariant,
  newExtraInput,
  onExtraInputChange,
  onAddExtra,
}: VariantBuilderModalProps) => {
  const { t } = useTranslation();

  if (!isOpen || !selectedDish) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
          <h3 className="font-bold text-base text-[var(--text-primary)]">{t('menu.variantsBuilder')}</h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 text-xs">
          <h4 className="font-bold text-[var(--primary)] text-sm">
            {selectedDish.nameKey.includes('.') ? t(selectedDish.nameKey) : selectedDish.nameKey}
          </h4>

          <div>
            <label className="font-semibold text-[var(--text-secondary)]">{t('menu.products.sizes')}</label>
            <div className="mt-1 space-y-1.5">
              {selectedDish.variants.map((v, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2">
                  <span>{v}</span>
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newVariantInput}
                onChange={(e) => onVariantInputChange(e.target.value)}
                placeholder="e.g. Large ($16.00)"
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2 text-xs font-medium focus:outline-none"
              />
              <button
                onClick={onAddVariant}
                className="rounded-xl bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white shadow cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-[var(--text-secondary)]">{t('menu.products.extras')}</label>
            <div className="mt-1 space-y-1.5">
              {selectedDish.extras.map((e, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2">
                  <span>{e}</span>
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newExtraInput}
                onChange={(e) => onExtraInputChange(e.target.value)}
                placeholder="e.g. Extra Sauce (+$1.00)"
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2 text-xs font-medium focus:outline-none"
              />
              <button
                onClick={onAddExtra}
                className="rounded-xl bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white shadow cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantBuilderModal;