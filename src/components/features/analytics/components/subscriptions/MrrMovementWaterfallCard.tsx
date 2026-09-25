import { memo, type FC } from 'react';
import {
  TrendingUp,
  PlusCircle,
  MinusCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { MRR_MOVEMENT_SUMMARY } from '../../analytics.mock';

export const MrrMovementWaterfallCard: FC = memo(() => {
  const { t } = useTranslation();

  const data = MRR_MOVEMENT_SUMMARY;
  const maxStepValue = Math.max(...data.steps.map((s) => Math.abs(s.amount)));

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('analytics.waterfall.title')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('analytics.waterfall.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Net MRR Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-500 text-xs font-bold shadow-sm">
          <TrendingUp className="h-4 w-4" />
          <span>
            {t('analytics.waterfall.netGrowth')}: +EGP {data.netNewMrr.toLocaleString()} (+12.4%)
          </span>
        </div>
      </div>

      {/* Waterfall Visual Columns */}
      <div className="pt-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 items-end">
          {data.steps.map((step) => {
            const isNegative = step.isNegative;
            const isPositive = step.isPositive;
            const isTotal = step.isTotal;

            // Height normalization
            const heightPercent = isTotal
              ? 100
              : Math.max(25, Math.round((Math.abs(step.amount) / maxStepValue) * 85));

            let barBg = 'bg-primary/80';
            let textColor = 'text-primary';
            let borderColor = 'border-primary/30';
            let sign = '';

            if (isPositive) {
              barBg = 'bg-emerald-500';
              textColor = 'text-emerald-500';
              borderColor = 'border-emerald-500/30';
              sign = '+';
            } else if (isNegative) {
              barBg = 'bg-rose-500';
              textColor = 'text-rose-500';
              borderColor = 'border-rose-500/30';
              sign = '-';
            } else if (isTotal) {
              barBg = 'bg-indigo-600';
              textColor = 'text-indigo-400';
              borderColor = 'border-indigo-500/30';
            }

            return (
              <div
                key={step.key}
                className={`group flex flex-col items-center justify-end rounded-xl border ${borderColor} bg-background/40 p-3 transition-all hover:scale-[1.02]`}
              >
                {/* Amount display */}
                <div className="mb-2 text-center">
                  <span className={`text-xs font-extrabold ${textColor}`}>
                    {sign}EGP {Math.abs(step.amount).toLocaleString()}
                  </span>
                </div>

                {/* Vertical Bar */}
                <div className="relative flex h-36 w-full items-end justify-center rounded-lg bg-muted/40 p-1">
                  <div
                    className={`w-full max-w-[42px] rounded-t-md ${barBg} transition-all duration-500 group-hover:brightness-110`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Step Name */}
                <div className="mt-3 text-center">
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    {t(step.labelKey)}
                  </span>
                </div>

                {/* Tag */}
                <div className="mt-1">
                  {isPositive && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-500">
                      <PlusCircle className="h-2.5 w-2.5" />
                      Inflow
                    </span>
                  )}
                  {isNegative && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-500">
                      <MinusCircle className="h-2.5 w-2.5" />
                      Outflow
                    </span>
                  )}
                  {isTotal && (
                    <span className="inline-flex items-center text-[10px] font-bold text-indigo-400">
                      Baseline
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula & SaaS Health Breakdown Footer */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3 text-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-semibold text-foreground">
              {t('analytics.waterfall.formulaLabel')}:
            </span>
            <span className="font-mono text-muted-foreground">
              New (18.2K) + Expansion (9.4K) - Contraction (2.8K) - Churn (4.5K) = +20.3K Net
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-emerald-500">
            <span>SaaS Quick Ratio: 3.8x</span>
            <span className="text-muted-foreground">
              ({t('analytics.waterfall.healthyGrowth')})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

MrrMovementWaterfallCard.displayName = 'MrrMovementWaterfallCard';
