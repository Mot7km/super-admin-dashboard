import { memo, useState, type FC } from 'react';
import {
  X,
  Webhook,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { WebhookEventLog } from '../integrations.types';

type WebhooksActivityDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  logs: WebhookEventLog[];
  onRetryWebhook: (logId: string) => void;
};

export const WebhooksActivityDrawer: FC<WebhooksActivityDrawerProps> = memo(({
  isOpen,
  onClose,
  logs,
  onRetryWebhook,
}) => {
  const { t, isRtl } = useTranslation();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRetry = (logId: string) => {
    setRetryingId(logId);
    setTimeout(() => {
      onRetryWebhook(logId);
      setRetryingId(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} flex max-w-full`}>
        <div className="w-screen max-w-lg border-s border-border bg-card shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Webhook className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t('integrations.drawer.webhooksTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('integrations.drawer.webhooksSubtitle')}
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

          {/* Logs List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {logs.map((log) => {
              const isRetrying = retryingId === log.id;
              const isSuccess = log.statusCode >= 200 && log.statusCode < 300;

              return (
                <div
                  key={log.id}
                  className="rounded-2xl border border-border/70 bg-background/60 p-4 space-y-3 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  {/* Top: Event & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {log.event}
                      </span>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {log.targetProvider}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                        isSuccess
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                          : 'border border-red-500/30 bg-red-500/10 text-red-500'
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span>HTTP {log.statusCode}</span>
                    </span>
                  </div>

                  {/* Endpoint URI */}
                  <div className="rounded-lg bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground truncate">
                    {log.endpoint}
                  </div>

                  {/* Payload Summary */}
                  <div className="text-[11px] text-muted-foreground font-mono bg-background/80 p-2 rounded-lg border border-border/50">
                    {log.payloadSummary}
                  </div>

                  {/* Bottom: Latency, Time & Retry */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground border-t border-border/40">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-blue-500" />
                        <span>{log.durationMs}ms</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{log.timestamp}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRetry(log.id)}
                      disabled={isRetrying}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 font-semibold text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{t('integrations.drawer.retry')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-border/80 p-4 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

WebhooksActivityDrawer.displayName = 'WebhooksActivityDrawer';
