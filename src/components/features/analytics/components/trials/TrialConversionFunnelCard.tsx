import { memo, type FC } from 'react';
import {
  Sparkles,
  GitCommit,
  CheckCircle2,
  TrendingDown,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import {
  TRIAL_CONVERSION_STEPS,
  TRIAL_STATUS_OVERVIEW,
} from '../../analytics.mock';

export const TrialConversionFunnelCard: FC = memo(() => {
  const { t, isRtl } = useTranslation();

  const steps = TRIAL_CONVERSION_STEPS;
  const status = TRIAL_STATUS_OVERVIEW;

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GitCommit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('analytics.trials.funnelTitle')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('analytics.trials.funnelSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Global Conversion Rate Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-500 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('analytics.trials.overallConversion')}:
            </span>
            <span className="text-xl font-extrabold">{status.conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* Trial Status Quick Badges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-xl border border-border/60 bg-background/50 p-3 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {t('analytics.trials.statusActive')}
          </span>
          <div className="text-xl font-extrabold text-amber-500">
            {status.activeTrials}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {t('analytics.trials.inProgress14d')}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {t('analytics.trials.statusConverted')}
          </span>
          <div className="text-xl font-extrabold text-emerald-500">
            {status.convertedPaid}
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>24.6% {t('analytics.trials.paidRate')}</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/50 p-3 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {t('analytics.trials.statusExpired')}
          </span>
          <div className="text-xl font-extrabold text-foreground">
            {status.expiredUnconverted}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {t('analytics.trials.gracePeriod')}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/50 p-3 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {t('analytics.trials.statusExtended')}
          </span>
          <div className="text-xl font-extrabold text-primary">
            {status.extendedTrials}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {t('analytics.trials.requestedExtensions')}
          </div>
        </div>
      </div>

      {/* 6-Stage Visual Funnel */}
      <div className="space-y-4">
        {steps.map((step) => {
          return (
            <div
              key={step.id}
              className="group relative rounded-xl border border-border/60 bg-background/50 p-3.5 transition-all hover:border-primary/40 hover:bg-background/80"
            >
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between text-xs mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-[11px]">
                    {step.stepNumber}
                  </div>
                  <span className="font-bold text-foreground">
                    {t(step.labelKey)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {step.stageAvgTimeDays !== undefined && (
                    <span className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Avg {step.stageAvgTimeDays}d</span>
                    </span>
                  )}

                  <span className="font-mono font-bold text-foreground">
                    {step.count.toLocaleString()}
                  </span>

                  <span className="w-12 text-end font-bold text-primary">
                    {step.conversionPercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500 group-hover:from-emerald-500 group-hover:to-teal-400"
                  style={{ width: `${step.conversionPercent}%` }}
                />
              </div>

              {/* Step Dropoff Indicator */}
              {step.dropoffPercent && (
                <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground font-mono">
                  <TrendingDown className="h-3 w-3 text-rose-500" />
                  <span>
                    -{step.dropoffPercent.toFixed(1)}% {t('analytics.trials.dropoff')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Velocity and Conversion Takeaway */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3.5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          <span>{t('analytics.trials.velocityInsight')}</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-foreground">
          <span>8.4 Days Velocity</span>
          <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
});

TrialConversionFunnelCard.displayName = 'TrialConversionFunnelCard';
