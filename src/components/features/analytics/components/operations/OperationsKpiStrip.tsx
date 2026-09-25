import { memo, type FC } from 'react';
import {
  Server,
  Activity,
  Headphones,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import {
  API_PERFORMANCE_SUMMARY,
  SUPPORT_OPERATIONS_DATA,
} from '../../analytics.mock';

export const OperationsKpiStrip: FC = memo(() => {
  const { t, isRtl } = useTranslation();

  const api = API_PERFORMANCE_SUMMARY;
  const support = SUPPORT_OPERATIONS_DATA;

  const kpis = [
    {
      key: 'apiVolume',
      titleKey: 'analytics.ops.apiVolumeTitle',
      value: `${(api.totalRequestsMonth / 1000000).toFixed(2)}M`,
      change: '+14.2%',
      isPositive: true,
      sublabelKey: 'analytics.ops.apiVolumeSubtitle',
      sublabelValue: `${api.meanLatencyMs}ms global mean latency`,
      icon: Server,
      color: 'text-primary',
      border: 'border-primary/20',
      bg: 'from-primary/10',
    },
    {
      key: 'sla',
      titleKey: 'analytics.ops.slaTitle',
      value: `${api.successRatePercent}%`,
      change: '+0.1%',
      isPositive: true,
      sublabelKey: 'analytics.ops.slaSubtitle',
      sublabelValue: 'Edge fleet availability',
      icon: Activity,
      color: 'text-emerald-500',
      border: 'border-emerald-500/20',
      bg: 'from-emerald-500/10',
    },
    {
      key: 'csat',
      titleKey: 'analytics.ops.csatTitle',
      value: `${support.csatScore} / 5.0`,
      change: '+0.2',
      isPositive: true,
      sublabelKey: 'analytics.ops.csatSubtitle',
      sublabelValue: `${support.csatPercentage}% merchant satisfaction`,
      icon: Headphones,
      color: 'text-amber-500',
      border: 'border-amber-500/20',
      bg: 'from-amber-500/10',
    },
    {
      key: 'mttr',
      titleKey: 'analytics.ops.mttrTitle',
      value: `${support.avgResolutionHours}h`,
      change: '-0.8h',
      isPositive: true,
      sublabelKey: 'analytics.ops.mttrSubtitle',
      sublabelValue: `FRT: ${support.avgFirstResponseMinutes}m response speed`,
      icon: Clock,
      color: 'text-teal-400',
      border: 'border-teal-400/20',
      bg: 'from-teal-400/10',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t('analytics.ops.sectionTitle')}
        </h3>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          <span>{t('analytics.ops.sectionSubtitle')}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className={`relative overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/40`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t(item.titleKey)}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border/80 shadow-sm ${item.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {item.value}
                </span>
                <span className={`flex items-center text-xs font-bold ${item.color}`}>
                  <ArrowUpRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-90' : ''}`} />
                  {item.change}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t(item.sublabelKey)}</span>
                <span className="font-mono font-semibold text-foreground/80">
                  {item.sublabelValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

OperationsKpiStrip.displayName = 'OperationsKpiStrip';
