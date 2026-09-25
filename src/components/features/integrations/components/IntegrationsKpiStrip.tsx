import { memo, type FC } from 'react';
import {
  PlugZap,
  Activity,
  CreditCard,
  BellRing,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { IntegrationsKpiSummary } from '../integrations.types';

type IntegrationsKpiStripProps = {
  kpis: IntegrationsKpiSummary;
};

export const IntegrationsKpiStrip: FC<IntegrationsKpiStripProps> = memo(({ kpis }) => {
  const { t, isRtl } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Connected Services */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('integrations.kpi.activeConnections')}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <PlugZap className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {kpis.totalConnected}
          </span>
          <span className="text-xs font-semibold text-emerald-500 flex items-center">
            <ArrowUpRight className={`h-3 w-3 ${isRtl ? 'rotate-90' : ''}`} />
            {t('integrations.kpi.allSystemsGo')}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{kpis.inSandbox} {t('integrations.kpi.inSandboxMode')}</span>
        </div>
      </div>

      {/* 2. Platform SLA & Health */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue-500/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('integrations.kpi.healthIndex')}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {kpis.systemHealthIndex}%
          </span>
          <span className="text-xs font-semibold text-blue-500 flex items-center">
            <ShieldCheck className="h-3.5 w-3.5 me-0.5" />
            99.9% SLA
          </span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {t('integrations.kpi.healthSubtitle')}
        </div>
      </div>

      {/* 3. Payment Processing Volume */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-violet-500/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('integrations.kpi.gatewayVolume')}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            ${(kpis.monthlyPaymentVolumeUsd / 1000).toFixed(1)}k
          </span>
          <span className="text-xs font-semibold text-violet-500">
            +14.2%
          </span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {t('integrations.kpi.volumeSubtitle')}
        </div>
      </div>

      {/* 4. Dispatched Messages */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-amber-500/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('integrations.kpi.messagesDispatched')}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <BellRing className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {(kpis.monthlyMessagesDispatched / 1000000).toFixed(2)}M
          </span>
          <span className="text-xs font-semibold text-amber-500">
            Push & SMS
          </span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {t('integrations.kpi.messagesSubtitle')}
        </div>
      </div>
    </div>
  );
});

IntegrationsKpiStrip.displayName = 'IntegrationsKpiStrip';
