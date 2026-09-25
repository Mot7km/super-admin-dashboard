import { memo, type FC } from 'react';
import {
  Building2,
  Store,
  Sparkles,
  CreditCard,
  Banknote,
  Users,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { KpiMetricItem, KpiMetricKey } from '../analytics.types';

type OverviewKpiStripProps = {
  kpis: KpiMetricItem[];
  compareWithPrevious: boolean;
};

export const OverviewKpiStrip: FC<OverviewKpiStripProps> = memo(({
  kpis,
  compareWithPrevious,
}) => {
  const { t, isRtl } = useTranslation();

  const getMetricIcon = (key: KpiMetricKey) => {
    switch (key) {
      case 'totalBusinesses':
        return <Building2 className="h-5 w-5 text-indigo-500" />;
      case 'activeBusinesses':
        return <Store className="h-5 w-5 text-emerald-500" />;
      case 'newBusinesses':
        return <Sparkles className="h-5 w-5 text-teal-500" />;
      case 'mrr':
        return <CreditCard className="h-5 w-5 text-emerald-500" />;
      case 'arr':
        return <Banknote className="h-5 w-5 text-violet-500" />;
      case 'activeUsers':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'orders':
        return <ShoppingBag className="h-5 w-5 text-amber-500" />;
      case 'churnRate':
        return <TrendingDown className="h-5 w-5 text-rose-500" />;
      case 'trialToPaid':
        return <Award className="h-5 w-5 text-emerald-500" />;
      default:
        return <Building2 className="h-5 w-5 text-primary" />;
    }
  };

  const formatValue = (value: number, format: KpiMetricItem['format'], currency?: string) => {
    if (format === 'currency') {
      if (value >= 1000000) {
        return `${currency || 'EGP'} ${(value / 1000000).toFixed(2)}M`;
      }
      return `${currency || 'EGP'} ${value.toLocaleString()}`;
    }
    if (format === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  // Simple Mini Sparkline SVG
  const renderSparkline = (data: number[], colorClass: string) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible opacity-75">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className={colorClass}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t('analytics.overview.coreKpisTitle')}
        </h3>
        <span className="text-[11px] text-muted-foreground">
          {compareWithPrevious ? t('analytics.overview.showingVsPrevious') : t('analytics.overview.showingCurrent')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((item) => {
          const isUp = item.trend === 'up';
          // Is this trend positive or negative for business?
          const isFavorable = item.isPositive;

          return (
            <div
              key={item.key}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                {/* Top: Label and Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground tracking-wide">
                      {t(item.labelKey)}
                    </span>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/80 line-clamp-1">
                      {t(item.descriptionKey)}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 shadow-sm transition-transform duration-200 group-hover:scale-105">
                    {getMetricIcon(item.key)}
                  </div>
                </div>

                {/* Center: Large Value */}
                <div className="mt-3.5 flex items-baseline justify-between gap-2">
                  <div className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {formatValue(item.current, item.format, item.currencyCode)}
                  </div>

                  {/* Sparkline */}
                  <div className="hidden sm:block">
                    {renderSparkline(
                      item.sparkline,
                      isFavorable ? 'text-emerald-500' : 'text-rose-500'
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom: Trend and Previous Comparison */}
              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                {compareWithPrevious ? (
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isFavorable
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                          : 'border border-rose-500/30 bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {isUp ? (
                        <TrendingUp className={`h-3 w-3 ${isRtl ? 'scale-x-[-1]' : ''}`} />
                      ) : (
                        <TrendingDown className={`h-3 w-3 ${isRtl ? 'scale-x-[-1]' : ''}`} />
                      )}
                      <span>
                        {isUp ? '+' : ''}
                        {item.percentChange.toFixed(1)}%
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      {t('analytics.overview.vsPrevious')}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    {t('analytics.overview.metricNominal')}
                  </span>
                )}

                {/* Previous Value Note */}
                <div className="text-[11px] font-mono text-muted-foreground">
                  {t('analytics.overview.prev')}: {formatValue(item.previous, item.format, item.currencyCode)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

OverviewKpiStrip.displayName = 'OverviewKpiStrip';
