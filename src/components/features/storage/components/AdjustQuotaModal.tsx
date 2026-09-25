import { memo, useState, useEffect, type FC, type FormEvent } from 'react';
import {
  X,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { BusinessStorageRecord } from '../storage.types';

type AdjustQuotaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  record: BusinessStorageRecord | null;
  onSave: (businessId: string, newQuotaGB: number) => void;
};

export const AdjustQuotaModal: FC<AdjustQuotaModalProps> = memo(({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const { t } = useTranslation();
  const [quotaGB, setQuotaGB] = useState<number>(10);

  useEffect(() => {
    if (record) {
      setQuotaGB(record.quotaGB);
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const quickPicks = [5, 10, 20, 50, 100];
  const newPercent = quotaGB > 0 ? Math.round((record.usedGB / quotaGB) * 100) : 100;
  const isOverQuota = record.usedGB > quotaGB;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (quotaGB <= 0) return;
    onSave(record.businessId, quotaGB);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('storage.modal.adjustTitle')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {record.businessName} ({record.businessCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Current Status Preview */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t('storage.modal.currentUsage')}:</span>
              <span className="font-mono font-bold text-foreground">
                {record.usedGB} GB
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t('storage.modal.currentQuota')}:</span>
              <span className="font-mono font-bold text-foreground">
                {record.quotaGB} GB ({record.usagePercent}%)
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">
              {t('storage.modal.quickPresets')}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {quickPicks.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setQuotaGB(val)}
                  className={`py-2 rounded-xl border font-mono text-xs font-bold transition-all ${
                    quotaGB === val
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background border-border text-foreground hover:bg-muted/50'
                  }`}
                >
                  {val} GB
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('storage.modal.newQuotaLabel')} (GB) *
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              value={quotaGB}
              onChange={(e) => setQuotaGB(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
            />
          </div>

          {/* Live Recalculation Preview */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isOverQuota
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              : newPercent > 80
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold">
              {isOverQuota ? (
                <AlertCircle className="h-4 w-4" />
              ) : newPercent > 80 ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>
                {t('storage.modal.projectedUsage')}: {record.usedGB} GB / {quotaGB} GB ({newPercent}%)
              </span>
            </div>
            {isOverQuota && (
              <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                {t('storage.modal.overQuotaWarning')}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all"
            >
              {t('common.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AdjustQuotaModal.displayName = 'AdjustQuotaModal';
