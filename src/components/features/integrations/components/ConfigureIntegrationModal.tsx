import { memo, useState, useEffect, type FC, type FormEvent } from 'react';
import {
  X,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { IntegrationItem, IntegrationEnvironment, IntegrationStatus } from '../integrations.types';

type ConfigureIntegrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  integration: IntegrationItem | null;
  onSave: (updated: IntegrationItem) => void;
};

export const ConfigureIntegrationModal: FC<ConfigureIntegrationModalProps> = memo(({
  isOpen,
  onClose,
  integration,
  onSave,
}) => {
  const { t } = useTranslation();

  const [environment, setEnvironment] = useState<IntegrationEnvironment>('production');
  const [status, setStatus] = useState<IntegrationStatus>('connected');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (integration) {
      setEnvironment(integration.environment);
      setStatus(integration.status);
      setWebhookUrl(integration.webhookUrl);
      setMonthlyLimit(integration.monthlyLimit !== null ? String(integration.monthlyLimit) : '');
      setCopied(false);
    }
  }, [integration]);

  if (!isOpen || !integration) return null;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      ...integration,
      environment,
      status,
      webhookUrl,
      monthlyLimit: monthlyLimit ? Number(monthlyLimit) : null,
      lastSyncAt: 'Just now',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('integrations.modal.configureTitle')}: {integration.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('integrations.modal.configureSubtitle')}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Security Notice Alert */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs text-blue-400">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-blue-500 mt-0.5" />
            <div>
              <span className="font-semibold">{t('integrations.modal.securityBadge')}: </span>
              {t('integrations.modal.securityDesc')}
            </div>
          </div>

          {/* Environment Selector (Production vs Sandbox) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t('integrations.modal.environmentLabel')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEnvironment('production')}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-bold transition-all ${
                  environment === 'production'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-sm'
                    : 'border-border/70 bg-card text-muted-foreground hover:border-border'
                }`}
              >
                <span>{t('integrations.env.production')}</span>
                <span className="mt-0.5 text-[10px] font-normal opacity-80">
                  {t('integrations.modal.liveTraffic')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEnvironment('sandbox')}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-bold transition-all ${
                  environment === 'sandbox'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm'
                    : 'border-border/70 bg-card text-muted-foreground hover:border-border'
                }`}
              >
                <span>{t('integrations.env.sandbox')}</span>
                <span className="mt-0.5 text-[10px] font-normal opacity-80">
                  {t('integrations.modal.testSimulations')}
                </span>
              </button>
            </div>
          </div>

          {/* Service Connection Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t('integrations.modal.statusLabel')}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IntegrationStatus)}
              className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="connected">{t('integrations.status.connected')}</option>
              <option value="degraded">{t('integrations.status.degraded')}</option>
              <option value="disconnected">{t('integrations.status.disconnected')}</option>
            </select>
          </div>

          {/* Masked Credentials Display */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t('integrations.modal.apiKeyLabel')}
            </label>
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 px-3.5 py-2.5 text-xs">
              <span className="font-mono text-xs font-semibold text-foreground">
                {integration.maskedKey}
              </span>
              <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                KMS PROTECTED
              </span>
            </div>
          </div>

          {/* Webhook Endpoint & Copy */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t('integrations.modal.webhookEndpointLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="h-10 w-full rounded-xl border border-border/70 bg-background ps-3 pe-12 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleCopyWebhook}
                className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Copy Webhook URL"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Monthly Quota / Rate Cap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t('integrations.modal.quotaLimitLabel')} ({integration.usageUnit})
            </label>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder={t('integrations.modal.unlimitedQuota')}
              className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground">
              {t('integrations.modal.quotaHelpText')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('common.saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ConfigureIntegrationModal.displayName = 'ConfigureIntegrationModal';
