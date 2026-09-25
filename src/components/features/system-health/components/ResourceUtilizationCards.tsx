import { memo, type FC } from 'react';
import {
  Cpu,
  HardDrive,
  Gauge,
  Wifi,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { ResourceMetric } from '../system-health.types';

type ResourceUtilizationCardsProps = {
  metrics: ResourceMetric[];
};

export const ResourceUtilizationCards: FC<ResourceUtilizationCardsProps> = memo(({ metrics }) => {
  const { t, locale } = useTranslation();

  const getMetricIcon = (id: string) => {
    switch (id) {
      case 'res-cpu':
        return <Cpu className="h-5 w-5 text-blue-500" />;
      case 'res-ram':
        return <Gauge className="h-5 w-5 text-emerald-500" />;
      case 'res-disk':
        return <HardDrive className="h-5 w-5 text-purple-500" />;
      case 'res-network':
        return <Wifi className="h-5 w-5 text-amber-500" />;
      default:
        return <Gauge className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-foreground sm:text-base">
          {t('systemHealth.resources.sectionTitle')}
        </h2>
        <p className="text-xs text-muted-foreground">
          {t('systemHealth.resources.sectionSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const label = locale === 'ar' ? metric.labelAr : metric.labelEn;
          const subText = locale === 'ar' ? metric.subTextAr : metric.subTextEn;

          return (
            <div
              key={metric.id}
              className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {label}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60">
                  {getMetricIcon(metric.id)}
                </div>
              </div>

              <div className="mt-3">
                <span className="text-lg font-bold text-foreground">
                  {metric.displayValue}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${metric.currentPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{subText}</span>
                  <span className="font-semibold text-foreground">{metric.currentPercent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ResourceUtilizationCards.displayName = 'ResourceUtilizationCards';
