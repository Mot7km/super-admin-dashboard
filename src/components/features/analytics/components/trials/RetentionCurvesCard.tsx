import { memo, useState, type FC } from 'react';
import {
  TrendingUp,
  Building2,
  Users2,
  Award,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { RETENTION_CURVES_DATA } from '../../analytics.mock';
import type { RetentionCurvePoint } from '../../analytics.types';

export const RetentionCurvesCard: FC = memo(() => {
  const { t } = useTranslation();
  const [hoveredPoint, setHoveredPoint] = useState<RetentionCurvePoint | null>(null);

  const points = RETENTION_CURVES_DATA;
  const activeHover = hoveredPoint || points[points.length - 1];

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.retention.curveTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.retention.curveSubtitle')}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-emerald-500" />
            <span className="font-semibold text-foreground">
              {t('analytics.retention.legendTenants')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-primary" />
            <span className="font-semibold text-foreground">
              {t('analytics.retention.legendUsers')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-muted-foreground/40" />
            <span className="text-muted-foreground">
              {t('analytics.retention.legendBenchmark')}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Month Summary */}
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-background/50 p-3 sm:grid-cols-4 text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            {t('analytics.retention.tenureMonth')}
          </span>
          <div className="mt-0.5 font-bold text-foreground">
            {activeHover.label}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3 text-emerald-500" />
            {t('analytics.retention.legendTenants')}
          </span>
          <div className="mt-0.5 font-extrabold text-emerald-500">
            {activeHover.tenantRetention}%
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
            <Users2 className="h-3 w-3 text-primary" />
            {t('analytics.retention.legendUsers')}
          </span>
          <div className="mt-0.5 font-extrabold text-primary">
            {activeHover.userRetention}%
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
            <Award className="h-3 w-3 text-amber-500" />
            SaaS Benchmark
          </span>
          <div className="mt-0.5 font-bold text-muted-foreground">
            {activeHover.benchmarkRetention}% (+{(activeHover.tenantRetention - activeHover.benchmarkRetention).toFixed(1)}% Alpha)
          </div>
        </div>
      </div>

      {/* Visual Comparative Bars across Months */}
      <div className="relative pt-4">
        <div className="flex h-48 items-end gap-3 sm:gap-6">
          {points.map((pt) => {
            const isHovered = hoveredPoint?.monthIndex === pt.monthIndex;

            return (
              <div
                key={pt.monthIndex}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div
                  className={`absolute -top-7 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-bold text-background shadow-md transition-opacity pointer-events-none whitespace-nowrap ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {pt.tenantRetention}% Tenants / {pt.userRetention}% Users
                </div>

                {/* Triple bar comparison */}
                <div className="flex items-end justify-center gap-1 w-full max-w-[54px] h-full">
                  {/* Tenant Retention Bar */}
                  <div
                    className="w-1/3 rounded-t-md bg-emerald-500 transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${pt.tenantRetention}%` }}
                  />
                  {/* User Retention Bar */}
                  <div
                    className="w-1/3 rounded-t-md bg-primary transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${pt.userRetention}%` }}
                  />
                  {/* Benchmark Bar */}
                  <div
                    className="w-1/3 rounded-t-md bg-muted-foreground/30 transition-all duration-300 group-hover:bg-muted-foreground/50"
                    style={{ height: `${pt.benchmarkRetention}%` }}
                  />
                </div>

                {/* X Axis Label */}
                <span className="mt-3 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {pt.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="border-t border-border/60 pt-4 text-xs text-muted-foreground flex items-center justify-between">
        <span>{t('analytics.retention.benchmarkExcellence')}</span>
        <span className="font-semibold text-emerald-500 font-mono">
          Mot7km Fleet: +16.3% above industry baseline
        </span>
      </div>
    </div>
  );
});

RetentionCurvesCard.displayName = 'RetentionCurvesCard';
