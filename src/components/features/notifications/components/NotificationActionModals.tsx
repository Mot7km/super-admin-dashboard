import { type FC } from 'react';
import {
  X,
  Send,
  AlertTriangle,
  Radio,
  Clock
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { NotificationModalAction } from '../notification.types';

type NotificationActionModalsProps = {
  modalAction: NotificationModalAction;
  onClose: () => void;
  onConfirmDispatch: () => void;
  onConfirmCancelScheduled: (broadcastId: string) => void;
};

export const NotificationActionModals: FC<NotificationActionModalsProps> = ({
  modalAction,
  onClose,
  onConfirmDispatch,
  onConfirmCancelScheduled,
}) => {
  const { t } = useTranslation();

  if (!modalAction) return null;

  // 1. Confirm Dispatch Modal
  if (modalAction.type === 'confirm_dispatch') {
    const broadcast = modalAction.broadcast;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              <span>{t('notifications.modal.confirmDispatchTitle')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 mb-5 text-xs text-foreground">
            <p className="text-muted-foreground">
              You are about to broadcast this notification across the platform. Please verify the transmission parameters:
            </p>

            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border space-y-2">
              <div>
                <span className="text-muted-foreground block text-[11px]">Headline:</span>
                <span className="font-bold text-foreground text-sm">{broadcast.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div>
                  <span className="text-muted-foreground block">Estimated Reach:</span>
                  <span className="font-bold text-primary">
                    {broadcast.audience?.estimatedUsersCount.toLocaleString()} Users
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Active Channels:</span>
                  <span className="font-bold text-foreground uppercase">
                    {broadcast.channels?.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Broadcasts dispatched immediately cannot be recalled from delivered devices.</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground">
              {t('notifications.modal.cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmDispatch();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 cursor-pointer"
            >
              {t('notifications.modal.authorizeTransmission')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Inspect Broadcast Dossier Modal
  if (modalAction.type === 'inspect_broadcast') {
    const broadcast = modalAction.broadcast;
    const readPercent = broadcast.metrics.deliveredCount > 0
      ? Math.round((broadcast.metrics.readCount / broadcast.metrics.deliveredCount) * 100)
      : 0;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              <span>Broadcast Dossier: {broadcast.id}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-subtle border border-border text-muted-foreground">
                {broadcast.type}
              </span>
              <h4 className="text-sm font-bold text-foreground mt-1.5">{broadcast.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                {broadcast.message}
              </p>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl bg-surface-subtle border border-border text-center font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block">Dispatched</span>
                <span className="text-sm font-bold text-foreground">{broadcast.metrics.sentCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block">Delivered</span>
                <span className="text-sm font-bold text-emerald-500">{broadcast.metrics.deliveredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block">Reads</span>
                <span className="text-sm font-bold text-primary">{broadcast.metrics.readCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block">Clicks</span>
                <span className="text-sm font-bold text-amber-500">{broadcast.metrics.clickCount}</span>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-muted-foreground">Engagement Rate:</span>
                <span className="font-bold text-primary">{readPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${readPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-border pt-4 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-card border border-border text-foreground hover:bg-surface-subtle"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Cancel Scheduled Broadcast Modal
  if (modalAction.type === 'cancel_scheduled') {
    const broadcast = modalAction.broadcast;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-rose-500" />
              <span>Cancel Scheduled Broadcast</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Are you sure you want to cancel scheduled broadcast <strong className="text-foreground">{broadcast.id}</strong> ({broadcast.title})? This will permanently stop the transmission timer.
          </p>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground">
              Keep Scheduled
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmCancelScheduled(broadcast.id);
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-sm hover:bg-rose-600"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
