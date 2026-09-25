import { memo, type FC } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Wallet,
  Flame,
  MessageSquare,
  Mail,
  HardDrive,
  MapPin,
  FileCheck2,
  Sliders,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  KeyRound,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { IntegrationItem, IntegrationStatus } from '../integrations.types';

type IntegrationCardGridProps = {
  integrations: IntegrationItem[];
  onConfigure: (item: IntegrationItem) => void;
  onTestPing: (item: IntegrationItem) => void;
};

export const IntegrationCardGrid: FC<IntegrationCardGridProps> = memo(({
  integrations,
  onConfigure,
  onTestPing,
}) => {
  const { t, locale } = useTranslation();

  const getProviderIcon = (key: IntegrationItem['providerKey']) => {
    switch (key) {
      case 'stripe':
        return <CreditCard className="h-6 w-6 text-indigo-500" />;
      case 'moyasar':
        return <ShieldCheck className="h-6 w-6 text-emerald-500" />;
      case 'tap':
        return <Wallet className="h-6 w-6 text-blue-500" />;
      case 'fcm':
        return <Flame className="h-6 w-6 text-amber-500" />;
      case 'twilio':
        return <MessageSquare className="h-6 w-6 text-rose-500" />;
      case 'resend':
        return <Mail className="h-6 w-6 text-cyan-500" />;
      case 's3':
        return <HardDrive className="h-6 w-6 text-orange-500" />;
      case 'google_maps':
        return <MapPin className="h-6 w-6 text-teal-500" />;
      case 'zatca':
        return <FileCheck2 className="h-6 w-6 text-purple-500" />;
      default:
        return <Radio className="h-6 w-6 text-primary" />;
    }
  };

  const getStatusBadge = (status: IntegrationStatus, env: IntegrationItem['environment']) => {
    if (env === 'sandbox') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-500">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          {t('integrations.status.sandbox')}
        </span>
      );
    }

    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t('integrations.status.connected')}
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-500">
            <AlertTriangle className="h-3 w-3" />
            {t('integrations.status.degraded')}
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            {t('integrations.status.disconnected')}
          </span>
        );
      default:
        return null;
    }
  };

  if (integrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <Radio className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <h4 className="text-sm font-semibold text-foreground">
          {t('integrations.noResultsTitle')}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          {t('integrations.noResultsDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {integrations.map((item) => {
        const description = locale === 'ar' ? item.descriptionAr : item.descriptionEn;
        const usagePercent = item.monthlyLimit
          ? Math.min(100, Math.round((item.monthlyUsage / item.monthlyLimit) * 100))
          : null;

        return (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            {/* Top row: Icon, Name, Category & Status */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-background/80 shadow-sm transition-transform duration-200 group-hover:scale-105">
                    {getProviderIcon(item.providerKey)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                      {item.name}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {t(`integrations.categoryNames.${item.category}`)}
                      </span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(item.status, item.environment)}
              </div>

              {/* Description */}
              <p className="mt-3.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
              </p>

              {/* Health Score & Latency Strip */}
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-border/50 bg-muted/20 p-2.5 text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                    {t('integrations.card.uptimeScore')}
                  </span>
                  <div className="mt-0.5 flex items-center gap-1 font-bold text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{item.healthScore}%</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                    {t('integrations.card.latency')}
                  </span>
                  <div className="mt-0.5 flex items-center gap-1 font-bold text-foreground">
                    <Radio className="h-3.5 w-3.5 text-blue-500" />
                    <span>{item.latencyMs} ms</span>
                  </div>
                </div>
              </div>

              {/* Monthly Volume / Throughput */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">
                    {t('integrations.card.monthlyThroughput')}
                  </span>
                  <span className="font-bold text-foreground">
                    {item.monthlyUsage.toLocaleString()} {item.usageUnit}
                  </span>
                </div>
                {usagePercent !== null && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          usagePercent > 80 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>{usagePercent}% {t('integrations.card.ofQuota')}</span>
                      <span>{item.monthlyLimit?.toLocaleString()} {item.usageUnit}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Masked Credentials Preview */}
              <div className="mt-3.5 flex items-center justify-between rounded-xl border border-border/40 bg-background/50 px-3 py-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span className="font-mono text-[11px] text-foreground font-semibold">
                    {item.maskedKey}
                  </span>
                </div>
                <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.environment.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{item.lastSyncAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onTestPing(item)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:border-primary hover:text-primary transition-colors"
                >
                  <Radio className="h-3.5 w-3.5 text-primary" />
                  <span>{t('integrations.actions.testPing')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onConfigure(item)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>{t('integrations.actions.configure')}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

IntegrationCardGrid.displayName = 'IntegrationCardGrid';
