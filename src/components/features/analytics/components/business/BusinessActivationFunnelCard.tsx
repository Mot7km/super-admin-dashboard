import { memo, type FC } from 'react';
import {
  GitCommit,
  CheckCircle2,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { ACTIVATION_FUNNEL_STEPS } from '../../analytics.mock';

export const BusinessActivationFunnelCard: FC = memo(() => {
  const { t } = useTranslation();

  const finalStep = ACTIVATION_FUNNEL_STEPS[ACTIVATION_FUNNEL_STEPS.length - 1];
  const finalActivationRate = finalStep.percentage;

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
                {t('analytics.funnel.title')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('analytics.funnel.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Activation Rate Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-500 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('analytics.funnel.overallActivation')}:
            </span>
            <span className="text-xl font-extrabold">{finalActivationRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 6-Stage Visual Funnel */}
      <div className="space-y-4">
        {ACTIVATION_FUNNEL_STEPS.map((step) => {
          return (
            <div
              key={step.id}
              className="group relative rounded-xl border border-border/60 bg-background/50 p-3.5 transition-all hover:border-primary/40 hover:bg-background/80"
            >
              <div className="flex items-center justify-between gap-3 text-xs mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-[11px]">
                    {step.stepNumber}
                  </div>
                  <span className="font-bold text-foreground">
                    {t(step.labelKey)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-foreground">
                    {step.count.toLocaleString()} {t('analytics.funnel.tenants')}
                  </span>
                  <span className="font-bold text-primary">
                    {step.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500 group-hover:from-emerald-500 group-hover:to-teal-400"
                  style={{ width: `${step.percentage}%` }}
                />
              </div>

              {/* Step Dropoff Indicator */}
              {step.dropoffPercent && (
                <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground font-mono">
                  <TrendingDown className="h-3 w-3 text-rose-500" />
                  <span>
                    -{step.dropoffPercent.toFixed(1)}% {t('analytics.funnel.dropoff')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel Takeaway */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3.5 flex items-center gap-3 text-xs text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
        <span>{t('analytics.funnel.takeaway')}</span>
      </div>
    </div>
  );
});

BusinessActivationFunnelCard.displayName = 'BusinessActivationFunnelCard';
