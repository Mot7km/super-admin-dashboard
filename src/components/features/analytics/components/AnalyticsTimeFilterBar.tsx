import { memo, type FC } from 'react';
import {
  Calendar,
  ArrowLeftRight,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { TimeRange } from '../analytics.types';

type AnalyticsTimeFilterBarProps = {
  timeRange: TimeRange;
  onSelectTimeRange: (range: TimeRange) => void;
  compareWithPrevious: boolean;
  onToggleCompare: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

export const AnalyticsTimeFilterBar: FC<AnalyticsTimeFilterBarProps> = memo(({
  timeRange,
  onSelectTimeRange,
  compareWithPrevious,
  onToggleCompare,
  onRefresh,
  isRefreshing,
}) => {
  const { t } = useTranslation();

  const presets: { key: TimeRange; labelKey: string }[] = [
    { key: 'today', labelKey: 'analytics.time.today' },
    { key: '7d', labelKey: 'analytics.time.7d' },
    { key: '30d', labelKey: 'analytics.time.30d' },
    { key: '3m', labelKey: 'analytics.time.3m' },
    { key: '6m', labelKey: 'analytics.time.6m' },
    { key: '12m', labelKey: 'analytics.time.12m' },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Time Presets Pills */}
      <div className="flex flex-wrap items-center gap-1">
        <div className="me-2 hidden items-center gap-1.5 text-xs font-semibold text-muted-foreground lg:flex">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>{t('analytics.time.rangeLabel')}:</span>
        </div>

        {presets.map(({ key, labelKey }) => {
          const isActive = timeRange === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectTimeRange(key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              }`}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Comparison Toggle & Refresh Button */}
      <div className="flex items-center gap-2.5 justify-end">
        {/* Comparison Toggle */}
        <button
          type="button"
          onClick={onToggleCompare}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
            compareWithPrevious
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500 shadow-sm'
              : 'border-border/80 bg-background/80 text-muted-foreground hover:border-border hover:text-foreground'
          }`}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span>{t('analytics.time.comparePrevious')}</span>
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              compareWithPrevious ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40'
            }`}
          />
        </button>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          title={t('analytics.time.refresh')}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{t('analytics.time.refresh')}</span>
        </button>
      </div>
    </div>
  );
});

AnalyticsTimeFilterBar.displayName = 'AnalyticsTimeFilterBar';
