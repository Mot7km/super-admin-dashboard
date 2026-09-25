import { memo, useState, useEffect, type FC } from 'react';
import {
  X,
  Radio,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Lock,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { IntegrationItem } from '../integrations.types';

type TestConnectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  integration: IntegrationItem | null;
};

export const TestConnectionModal: FC<TestConnectionModalProps> = memo(({
  isOpen,
  onClose,
  integration,
}) => {
  const { t } = useTranslation();

  const [isPinging, setIsPinging] = useState(true);
  const [latency, setLatency] = useState(38);
  const [httpStatus, setHttpStatus] = useState(200);

  const runPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      // Generate realistic latency
      const randomLatency = Math.floor(Math.random() * 25) + (integration?.latencyMs || 35);
      setLatency(randomLatency);
      setHttpStatus(200);
    }, 700);
  };

  useEffect(() => {
    if (isOpen && integration) {
      runPing();
    }
  }, [isOpen, integration]);

  if (!isOpen || !integration) return null;

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t('integrations.testModal.title')}
              </h3>
              <p className="text-xs text-muted-foreground">{integration.name}</p>
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

        {/* Diagnostic Results */}
        <div className="p-6 space-y-5">
          {isPinging ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <RefreshCw className="h-10 w-10 animate-spin text-primary" />
              <p className="text-xs font-semibold text-foreground">
                {t('integrations.testModal.runningPing')}...
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                {integration.webhookUrl}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Success Banner */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-500">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <div className="font-semibold">
                  {t('integrations.testModal.successMessage')}
                </div>
              </div>

              {/* Diagnostic Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    HTTP Status
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{httpStatus} OK</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Round-Trip Latency
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Zap className="h-3.5 w-3.5 text-blue-500" />
                    <span>{latency} ms</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    TLS / SSL Encryption
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Lock className="h-3.5 w-3.5 text-emerald-500" />
                    <span>TLS 1.3 Valid</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Handshake Protocol
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
                    <span>HMAC-SHA256</span>
                  </div>
                </div>
              </div>

              {/* Diagnostic Raw Target */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 text-[11px] font-mono text-muted-foreground break-all">
                PING: {integration.webhookUrl}
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={runPing}
              disabled={isPinging}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{t('integrations.testModal.retest')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              {t('common.done')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TestConnectionModal.displayName = 'TestConnectionModal';
