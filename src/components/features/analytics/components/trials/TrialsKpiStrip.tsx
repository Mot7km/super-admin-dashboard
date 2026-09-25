import { memo, type FC } from 'react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { TRIAL_STATUS_OVERVIEW } from '../../analytics.mock';

export const TrialsKpiStrip: FC = memo(() => {
  const { t, isRtl } = useTranslation();

  const data = TRIAL_STATUS_OVERVIEW;

  const kpis = [
    {
      key: 'conversion',
      titleKey: 'analytics.trials.conversionTitle',
      value: `${data.conversionRate.toFixed(1)}%`,
      change: '+2.8%',
      isPositive: true,
      sublabelKey: 'analytics.trials.conversionSubtitle',
      sublabelValue: `${data.convertedPaid} converted / 1,000`,
      icon: Sparkles,
      color: 'text-emerald-500',
      border: 'border-emerald-500/20',
      bg: 'from-emerald-500/10',
    },
    {
      key: 'activeTrials',
      titleKey: 'analytics.trials.activeTitle',
      value: data.activeTrials.toLocaleString(),
      change: '+14.2%',
      isPositive: true,
      sublabelKey: 'analytics.trials.activeSubtitle',
      sublabelValue: 'currently exploring features',
      icon: Flame,
      color: 'text-amber-500',
      border: 'border-amber-500/20',
      bg: 'from-amber-500/10',
    },
    {
      key: 'velocity',
      titleKey: 'analytics.trials.velocityTitle',
      value: `${data.avgDaysToConvert} Days`,
      change: '-1.2 Days',
      isPositive: true,
      sublabelKey: 'analytics.trials.velocitySubtitle',
      sublabelValue: 'out of 14 days free trial',
      icon: Clock,
      color: 'text-primary',
      border: 'border-primary/20',
      bg: 'from-primary/10',
    },
    {
      key: 'retentionM1',
      titleKey: 'analytics.trials.retentionM1Title',
      value: '82.4%',
      change: '+4.1%',
      isPositive: true,
      sublabelKey: 'analytics.trials.retentionM1Subtitle',
      sublabelValue: 'Top 10% SaaS Benchmark',
      icon: ShieldCheck,
      color: 'text-teal-400',
      border: 'border-teal-400/20',
      bg: 'from-teal-400/10',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t('analytics.trials.sectionTitle')}
        </h3>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          <span>{t('analytics.trials.sectionSubtitle')}</span>
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

TrialsKpiStrip.displayName = 'TrialsKpiStrip';
