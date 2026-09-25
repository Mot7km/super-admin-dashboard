import { memo, useState, type FC } from 'react';
import {
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import type { BusinessGrowthMonth } from '../../analytics.types';
import { BUSINESS_GROWTH_MONTHS } from '../../analytics.mock';

export const BusinessGrowthTrendChart: FC = memo(() => {
  const { t, locale } = useTranslation();
  const [hoveredMonth, setHoveredMonth] = useState<BusinessGrowthMonth | null>(null);

  const months = BUSINESS_GROWTH_MONTHS;
  const maxVal = Math.max(...months.map((m) => m.newCount));
  const activeHover = hoveredMonth || months[months.length - 1];

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('analytics.growthChart.title')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('analytics.growthChart.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-primary" />
            <span className="text-muted-foreground">{t('analytics.growthChart.new')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-emerald-500" />
            <span className="text-muted-foreground">{t('analytics.growthChart.activated')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-amber-500" />
            <span className="text-muted-foreground">{t('analytics.growthChart.suspended')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-blue-500" />
            <span className="text-muted-foreground">{t('analytics.growthChart.reactivated')}</span>
          </div>
        </div>
      </div>

      {/* Hover Month Summary */}
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-background/50 p-3 sm:grid-cols-4 text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            {t('analytics.growthChart.month')}
          </span>
          <div className="mt-0.5 font-bold text-foreground">
            {locale === 'ar' ? activeHover.labelAr : activeHover.labelEn}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            {t('analytics.growthChart.new')}
          </span>
          <div className="mt-0.5 font-bold text-primary">
            +{activeHover.newCount}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            {t('analytics.growthChart.activated')}
          </span>
          <div className="mt-0.5 font-bold text-emerald-500">
            +{activeHover.activatedCount}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            {t('analytics.growthChart.netAddition')}
          </span>
          <div className="mt-0.5 font-bold text-teal-400">
            +{activeHover.activatedCount + activeHover.reactivatedCount - activeHover.suspendedCount} Net
          </div>
        </div>
      </div>

      {/* Monthly Chart Bars Container */}
      <div className="relative pt-4">
        <div className="flex h-52 items-end gap-3 sm:gap-6">
          {months.map((m) => {
            const isHovered = hoveredMonth?.monthKey === m.monthKey;
            const newHeight = Math.round((m.newCount / maxVal) * 100);
            const actHeight = Math.round((m.activatedCount / maxVal) * 100);
            const label = locale === 'ar' ? m.labelAr : m.labelEn;

            return (
              <div
                key={m.monthKey}
                onMouseEnter={() => setHoveredMonth(m)}
                onMouseLeave={() => setHoveredMonth(null)}
                className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
              >
                {/* Tooltip on top */}
                <div
                  className={`absolute -top-7 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-bold text-background shadow-md transition-opacity pointer-events-none whitespace-nowrap ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  +{m.newCount} New / +{m.activatedCount} Active
                </div>

                {/* Bars Group */}
                <div className="flex items-end justify-center gap-1.5 w-full max-w-[56px] h-full">
                  {/* New Bar */}
                  <div
                    className="w-1/2 rounded-t-lg bg-primary transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${newHeight}%` }}
                  />
                  {/* Activated Bar */}
                  <div
                    className="w-1/2 rounded-t-lg bg-emerald-500 transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${actHeight}%` }}
                  />
                </div>

                {/* X Axis Label */}
                <span className="mt-3 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>{t('analytics.growthChart.growthMoM')}</span>
        </div>
        <div className="font-mono text-[11px]">
          Activation Efficiency: 67.4%
        </div>
      </div>
    </div>
  );
});

BusinessGrowthTrendChart.displayName = 'BusinessGrowthTrendChart';
