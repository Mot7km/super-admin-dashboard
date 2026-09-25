import { memo, type FC } from 'react';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { MRR_MOVEMENT_SUMMARY } from '../../analytics.mock';

export const RevenueKpiStrip: FC = memo(() => {
  const { t, isRtl } = useTranslation();

  const data = MRR_MOVEMENT_SUMMARY;

  const kpis = [
    {
      key: 'mrr',
      titleKey: 'analytics.revenue.mrrTitle',
      value: `EGP ${data.endingMrr.toLocaleString()}`,
      change: '+12.4%',
      isPositive: true,
      sublabelKey: 'analytics.revenue.netAdditionSubtitle',
      sublabelValue: `+EGP ${data.netNewMrr.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      border: 'border-emerald-500/20',
      bg: 'from-emerald-500/10',
    },
    {
      key: 'arr',
      titleKey: 'analytics.revenue.arrTitle',
      value: `EGP ${(data.endingMrr * 12).toLocaleString()}`,
      change: '+12.2%',
      isPositive: true,
      sublabelKey: 'analytics.revenue.arrRunRateSubtitle',
      sublabelValue: 'MRR × 12 annualized',
      icon: TrendingUp,
      color: 'text-primary',
      border: 'border-primary/20',
      bg: 'from-primary/10',
    },
    {
      key: 'arpu',
      titleKey: 'analytics.revenue.arpuTitle',
      value: 'EGP 197.5',
      change: '+3.8%',
      isPositive: true,
      sublabelKey: 'analytics.revenue.arpuSubtitle',
      sublabelValue: 'per paying merchant',
      icon: Coins,
      color: 'text-indigo-500',
      border: 'border-indigo-500/20',
      bg: 'from-indigo-500/10',
    },
    {
      key: 'quickRatio',
      titleKey: 'analytics.revenue.quickRatioTitle',
      value: `${data.quickRatio.toFixed(1)}x`,
      change: 'Optimal',
      isPositive: true,
      sublabelKey: 'analytics.revenue.quickRatioSubtitle',
      sublabelValue: '> 3.5x Excellent Growth',
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
          {t('analytics.revenue.sectionTitle')}
        </h3>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          <span>{t('analytics.revenue.sectionSubtitle')}</span>
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

RevenueKpiStrip.displayName = 'RevenueKpiStrip';
