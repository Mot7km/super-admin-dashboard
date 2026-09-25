import { memo, useState, type FC } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Building2,
  CreditCard,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { PulsePoint } from '../analytics.types';
import { PULSE_CHART_MONTHLY, PULSE_CHART_WEEKLY } from '../analytics.mock';

export const OverviewPulseChart: FC = memo(() => {
  const { t, locale } = useTranslation();
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [hoveredPoint, setHoveredPoint] = useState<PulsePoint | null>(null);

  const data: PulsePoint[] = viewMode === 'monthly' ? PULSE_CHART_MONTHLY : PULSE_CHART_WEEKLY;

  const maxMrr = Math.max(...data.map((d) => d.mrr));
  const activeHover = hoveredPoint || data[data.length - 1];

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('analytics.pulse.title')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('analytics.pulse.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === 'monthly'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('analytics.pulse.monthly')}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('weekly')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === 'weekly'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('analytics.pulse.weekly')}
          </button>
        </div>
      </div>

      {/* Hero Stats Hover Preview */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/50 bg-background/50 p-4 sm:grid-cols-4">
        <div>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            {t('analytics.pulse.period')}
          </span>
          <div className="mt-1 flex items-center gap-1.5 font-bold text-foreground text-sm">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{locale === 'ar' ? activeHover.labelAr : activeHover.labelEn}</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            {t('analytics.kpi.mrr')}
          </span>
          <div className="mt-1 flex items-center gap-1.5 font-bold text-emerald-500 text-sm">
            <CreditCard className="h-3.5 w-3.5" />
            <span>EGP {activeHover.mrr.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            {t('analytics.pulse.activeTenants')}
          </span>
          <div className="mt-1 flex items-center gap-1.5 font-bold text-indigo-500 text-sm">
            <Building2 className="h-3.5 w-3.5" />
            <span>{activeHover.activeBusinesses.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            {t('analytics.pulse.newSignups')}
          </span>
          <div className="mt-1 font-bold text-teal-500 text-sm">
            +{activeHover.newBusinesses} {t('analytics.pulse.new')}
          </div>
        </div>
      </div>

      {/* Visual Chart Bars Container */}
      <div className="relative pt-6">
        <div className="flex h-56 items-end gap-3 sm:gap-6">
          {data.map((point) => {
            const heightPercent = Math.round((point.mrr / maxMrr) * 100);
            const isHovered = hoveredPoint?.id === point.id;
            const label = locale === 'ar' ? point.labelAr : point.labelEn;

            return (
              <div
                key={point.id}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
              >
                {/* Value on top of bar on hover */}
                <div
                  className={`absolute -top-7 rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-bold text-background shadow-md transition-opacity pointer-events-none whitespace-nowrap ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  EGP {(point.mrr / 1000).toFixed(0)}k
                </div>

                {/* Primary MRR Bar */}
                <div className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-primary/30 to-primary transition-all duration-300 group-hover:from-emerald-500/40 group-hover:to-emerald-500 group-hover:scale-y-[1.03] group-hover:shadow-lg group-hover:shadow-primary/20"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="h-full w-full rounded-t-xl opacity-30 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white" />
                </div>

                {/* X-axis Label */}
                <span className="mt-3 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer Legend */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-md bg-primary" />
            <span>{t('analytics.pulse.mrrGrowthLegend')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>{t('analytics.pulse.activeTenantsLegend')}</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
          <BarChart3 className="h-3.5 w-3.5 text-primary" />
          <span>SaaS Growth Rate: +12.4% MoM</span>
        </div>
      </div>
    </div>
  );
});

OverviewPulseChart.displayName = 'OverviewPulseChart';
