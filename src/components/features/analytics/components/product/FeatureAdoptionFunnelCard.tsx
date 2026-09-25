import { memo, type FC } from 'react';
import {
  ToggleLeft,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { FEATURE_ADOPTION_FUNNEL_STEPS } from '../../analytics.mock';

export const FeatureAdoptionFunnelCard: FC = memo(() => {
  const { t } = useTranslation();

  const steps = FEATURE_ADOPTION_FUNNEL_STEPS;
  const finalStep = steps[steps.length - 1];

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ToggleLeft className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.adoption.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.adoption.subtitle')}
            </p>
          </div>
        </div>

        {/* Adoption Rate Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-primary text-xs font-bold shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span>
            {t('analytics.adoption.habitualRate')}: {finalStep.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 4-Stage Adoption Funnel */}
      <div className="space-y-4">
        {steps.map((step) => {
          return (
            <div
              key={step.id}
              className="group relative rounded-xl border border-border/60 bg-background/50 p-3.5 transition-all hover:border-primary/40 hover:bg-background/80"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-[11px]">
                    {step.stepNumber}
                  </div>
                  <span className="font-bold text-foreground">
                    {t(step.labelKey)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-foreground">
                    {step.count} {t('analytics.features.merchants')}
                  </span>
                  <span className="w-12 text-end font-bold text-primary">
                    {step.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
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
                    -{step.dropoffPercent.toFixed(1)}% {t('analytics.trials.dropoff')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature Flag Sync Note */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{t('analytics.adoption.flagSyncNotice')}</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-emerald-500">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Live Staged Canary Rollout</span>
        </div>
      </div>
    </div>
  );
});

FeatureAdoptionFunnelCard.displayName = 'FeatureAdoptionFunnelCard';
