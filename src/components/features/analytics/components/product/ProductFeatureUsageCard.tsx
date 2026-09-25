import { memo, type FC } from 'react';
import {
  Layers,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { PRODUCT_FEATURE_USAGE_DATA } from '../../analytics.mock';

export const ProductFeatureUsageCard: FC = memo(() => {
  const { t } = useTranslation();

  const features = PRODUCT_FEATURE_USAGE_DATA;

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.features.matrixTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.features.matrixSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-500 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Core Modules High Adoption</span>
        </div>
      </div>

      {/* Feature Usage Grid */}
      <div className="space-y-4">
        {features.map((feat) => {
          return (
            <div
              key={feat.id}
              className="rounded-xl border border-border/60 bg-background/50 p-4 transition-all hover:bg-background/80 space-y-2.5"
            >
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`h-3 w-3 rounded-full ${feat.color}`} />
                  <span className="font-bold text-foreground">
                    {t(feat.nameKey)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    <span>{feat.dailyInteractions.toLocaleString()} {t('analytics.features.dailyActions')}</span>
                  </span>

                  <span className="font-mono font-bold text-foreground">
                    {feat.adoptionCount} {t('analytics.features.merchants')}
                  </span>

                  <span className="w-14 text-end font-extrabold text-primary">
                    {feat.adoptionPercent}%
                  </span>

                  <span className="flex items-center gap-0.5 font-bold text-emerald-500 text-[11px]">
                    <TrendingUp className="h-3 w-3" />
                    {feat.trend}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${feat.color} transition-all duration-500`}
                  style={{ width: `${feat.adoptionPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="border-t border-border/60 pt-4 text-xs text-muted-foreground flex items-center justify-between">
        <span>{t('analytics.features.stickinessDriver')}</span>
        <span className="font-semibold text-emerald-500 font-mono">
          Merchants utilizing 3+ modules churn at &lt; 0.9%
        </span>
      </div>
    </div>
  );
});

ProductFeatureUsageCard.displayName = 'ProductFeatureUsageCard';
