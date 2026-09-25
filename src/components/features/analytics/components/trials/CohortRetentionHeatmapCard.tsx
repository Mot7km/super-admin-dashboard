import { memo, useState, type FC } from 'react';
import {
  CalendarRange,
  Users2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import type { CohortMonthItem } from '../../analytics.types';
import { COHORT_MONTHS_DATA } from '../../analytics.mock';

export const CohortRetentionHeatmapCard: FC = memo(() => {
  const { t, locale } = useTranslation();
  const [hoveredCell, setHoveredCell] = useState<{
    cohortLabel: string;
    monthIndex: number;
    percent: number;
    retainedCount: number;
  } | null>(null);

  const cohorts = COHORT_MONTHS_DATA;
  const monthHeaders = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];

  const getCellColor = (val: number | null) => {
    if (val === null) return 'bg-muted/10 text-muted-foreground/30';
    if (val >= 90) return 'bg-emerald-600/90 text-white font-extrabold shadow-sm';
    if (val >= 80) return 'bg-emerald-500/80 text-emerald-50 font-bold';
    if (val >= 70) return 'bg-teal-500/75 text-teal-50 font-semibold';
    if (val >= 60) return 'bg-primary/70 text-primary-foreground font-semibold';
    if (val >= 50) return 'bg-indigo-500/60 text-indigo-50 font-medium';
    return 'bg-amber-500/50 text-amber-50';
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.cohort.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.cohort.subtitle')}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-muted-foreground me-1">{t('analytics.cohort.retentionScale')}:</span>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-5 rounded bg-emerald-600" />
            <span className="text-muted-foreground">&gt;90%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-5 rounded bg-emerald-500/80" />
            <span className="text-muted-foreground">80-89%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-5 rounded bg-teal-500/75" />
            <span className="text-muted-foreground">70-79%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-5 rounded bg-primary/70" />
            <span className="text-muted-foreground">60-69%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-5 rounded bg-indigo-500/60" />
            <span className="text-muted-foreground">50-59%</span>
          </div>
        </div>
      </div>

      {/* Cohort Heatmap Table Container */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full min-w-[620px] text-center text-xs border-separate border-spacing-1.5">
          <thead>
            <tr>
              <th className="text-start py-2 px-3 font-semibold text-muted-foreground uppercase text-[11px]">
                {t('analytics.cohort.colCohort')}
              </th>
              <th className="py-2 px-3 font-semibold text-muted-foreground uppercase text-[11px]">
                {t('analytics.cohort.colSize')}
              </th>
              {monthHeaders.map((header) => (
                <th
                  key={header}
                  className="py-2 px-3 font-bold text-foreground text-[11px]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort: CohortMonthItem) => {
              const label = locale === 'ar' ? cohort.labelAr : cohort.labelEn;

              return (
                <tr key={cohort.monthKey} className="group">
                  {/* Cohort Name */}
                  <td className="text-start py-2 px-3 font-bold text-foreground whitespace-nowrap">
                    {label}
                  </td>

                  {/* Cohort Initial Size */}
                  <td className="py-2 px-3 font-mono font-semibold text-muted-foreground">
                    <span className="flex items-center justify-center gap-1">
                      <Users2 className="h-3 w-3 text-primary/70" />
                      {cohort.cohortSize}
                    </span>
                  </td>

                  {/* Month Retention Cells M0..M5 */}
                  {cohort.retentionPercentages.map((val, mIdx) => {
                    const colorClass = getCellColor(val);
                    const retainedCount =
                      val !== null ? Math.round(cohort.cohortSize * (val / 100)) : 0;

                    return (
                      <td
                        key={mIdx}
                        onMouseEnter={() => {
                          if (val !== null) {
                            setHoveredCell({
                              cohortLabel: label,
                              monthIndex: mIdx,
                              percent: val,
                              retainedCount,
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`rounded-xl py-2.5 px-3 transition-transform hover:scale-105 cursor-default ${colorClass}`}
                      >
                        {val !== null ? `${val.toFixed(1)}%` : '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dynamic Hover Detail / Footer Info */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
        {hoveredCell ? (
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>
              {hoveredCell.cohortLabel} ({monthHeaders[hoveredCell.monthIndex]}):{' '}
              <span className="text-emerald-500 font-extrabold">{hoveredCell.percent}%</span> retained ({hoveredCell.retainedCount} active businesses)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span>{t('analytics.cohort.hoverInstruction')}</span>
          </div>
        )}

        <div className="text-[11px] text-muted-foreground font-mono">
          Average Month 3 Stickiness: 68.2%
        </div>
      </div>
    </div>
  );
});

CohortRetentionHeatmapCard.displayName = 'CohortRetentionHeatmapCard';
