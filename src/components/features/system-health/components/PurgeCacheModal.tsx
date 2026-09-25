import { memo, useState, type FC, type FormEvent } from 'react';
import {
  X,
  Trash2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';

type PurgeCacheModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPurge: (scope: string) => void;
};

export const PurgeCacheModal: FC<PurgeCacheModalProps> = memo(({
  isOpen,
  onClose,
  onConfirmPurge,
}) => {
  const { t } = useTranslation();
  const [scope, setScope] = useState('all');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;
    onConfirmPurge(scope);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t('systemHealth.purgeModal.title')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('systemHealth.purgeModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-500">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t('systemHealth.purgeModal.warningTitle')}: </span>
              {t('systemHealth.purgeModal.warningDesc')}
            </div>
          </div>

          {/* Scope Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t('systemHealth.purgeModal.scopeLabel')}
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">{t('systemHealth.purgeModal.scopeAll')}</option>
              <option value="sessions">{t('systemHealth.purgeModal.scopeSessions')}</option>
              <option value="ratelimit">{t('systemHealth.purgeModal.scopeRateLimit')}</option>
              <option value="pos">{t('systemHealth.purgeModal.scopePos')}</option>
            </select>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground cursor-pointer hover:bg-muted/40 transition-colors">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="font-medium text-foreground">
              {t('systemHealth.purgeModal.confirmCheckbox')}
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={!isConfirmed}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>{t('systemHealth.purgeModal.purgeButton')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

PurgeCacheModal.displayName = 'PurgeCacheModal';
