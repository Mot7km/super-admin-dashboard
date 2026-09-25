import { memo, type FC } from 'react';
import {
  Activity,
  Zap,
  Database,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SystemHealthKpis } from '../system-health.types';

type SystemHealthKpiStripProps = {
  kpis: SystemHealthKpis;
};

export const SystemHealthKpiStrip: FC<SystemHealthKpiStripProps> = memo(({ kpis }) => {
  const { t, isRtl } = useTranslation();

  const dbPoolPercent = Math.round((kpis.activeDbConnections / kpis.maxDbConnections) * 100);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Uptime */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('systemHealth.kpi.uptime')}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {kpis.uptimePercent}%
          </span>
          <span className="text-xs font-semibold text-emerald-500 flex items-center">
            <ArrowUpRight className={`h-3 w-3 ${isRtl ? 'rotate-90' : ''}`} />
            30d SLA
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>{t('systemHealth.kpi.zeroOutages')}</span>
        </div>
      </div>

      {/* 2. Global Latency */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue-500/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('systemHealth.kpi.globalLatency')}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Zap className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {kpis.avgLatencyMs}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">ms</span>
          <span className="text-xs font-semibold text-blue-500">
            {t('systemHealth.kpi.optimal')}
          </span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {t('systemHealth.kpi.latencySubtitle')}
        </div>
      </div>

      {/* 3. Database Connection Pool */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-violet-500/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('systemHealth.kpi.dbPool')}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <Database className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {kpis.activeDbConnections}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            / {kpis.maxDbConnections} {t('systemHealth.kpi.activeConns')}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${dbPoolPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-violet-500">{dbPoolPercent}%</span>
        </div>
      </div>

      {/* 4. Background Job Queues */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-amber-500/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('systemHealth.kpi.jobQueues')}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Cpu className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {kpis.jobQueueThroughput.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-amber-500">
            jobs/min
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-500">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{kpis.failedJobsCount} {t('systemHealth.kpi.failedJobsZero')}</span>
        </div>
      </div>
    </div>
  );
});

SystemHealthKpiStrip.displayName = 'SystemHealthKpiStrip';
