import { memo, type FC } from 'react';
import {
  X,
  PowerOff,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { FeatureFlag } from '../feature-flags.types';

type KillSwitchConfirmModalProps = {
  isOpen: boolean;
  flag: FeatureFlag | null;
  mode: 'toggleOff' | 'delete';
  onClose: () => void;
  onConfirm: () => void;
};

export const KillSwitchConfirmModal: FC<KillSwitchConfirmModalProps> = memo(({
  isOpen,
  flag,
  mode,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !flag) return null;

  const isDelete = mode === 'delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-rose-500/30 bg-card p-6 shadow-2xl">
        {/* Header Icon */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {isDelete ? <Trash2 className="h-6 w-6" /> : <PowerOff className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isDelete
                  ? t('featureFlags.killSwitch.deleteTitle')
                  : t('featureFlags.killSwitch.toggleOffTitle')}
              </h3>
              <p className="text-xs text-rose-400 font-medium">
                {t('featureFlags.killSwitch.blastRadiusWarning')}
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

        {/* Body content */}
        <div className="py-4 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isDelete
              ? t('featureFlags.killSwitch.deleteDescription')
              : t('featureFlags.killSwitch.toggleOffDescription')}
          </p>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
            <div className="text-xs font-bold text-foreground">{flag.name}</div>
            <div className="font-mono text-[11px] text-muted-foreground">{flag.key}</div>
            <div className="text-[11px] text-amber-500 font-semibold mt-1 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              <span>Target: {flag.targetType.toUpperCase()} ({flag.targetLabels?.join(', ') || 'Global'})</span>
            </div>
          </div>
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
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
          >
            {isDelete
              ? t('featureFlags.killSwitch.confirmDelete')
              : t('featureFlags.killSwitch.confirmKillSwitch')}
          </button>
        </div>
      </div>
    </div>
  );
});

KillSwitchConfirmModal.displayName = 'KillSwitchConfirmModal';
