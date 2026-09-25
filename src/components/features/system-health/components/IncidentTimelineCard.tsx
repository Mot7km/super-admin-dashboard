import { memo, type FC } from 'react';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  History,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SystemIncident } from '../system-health.types';

type IncidentTimelineCardProps = {
  incidents: SystemIncident[];
};

export const IncidentTimelineCard: FC<IncidentTimelineCardProps> = memo(({ incidents }) => {
  const { t, locale } = useTranslation();

  const getSeverityBadge = (severity: SystemIncident['severity']) => {
    switch (severity) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
            <CheckCircle2 className="h-3 w-3" />
            {t('systemHealth.incidents.resolved')}
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">
            <Info className="h-3 w-3" />
            {t('systemHealth.incidents.info')}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
            <AlertTriangle className="h-3 w-3" />
            {t('systemHealth.incidents.warning')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur-sm space-y-5">
      {/* Header with Live Status Beacon */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground sm:text-base">
              {t('systemHealth.incidents.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('systemHealth.incidents.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500">
          <ShieldCheck className="h-4 w-4" />
          <span>{t('systemHealth.incidents.allOperational')}</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {incidents.map((inc) => {
          const title = locale === 'ar' ? inc.titleAr : inc.titleEn;
          const description = locale === 'ar' ? inc.descriptionAr : inc.descriptionEn;

          return (
            <div
              key={inc.id}
              className="relative ps-6 before:absolute before:start-2 before:top-2 before:h-full before:w-px before:bg-border/80 last:before:hidden"
            >
              {/* Dot */}
              <div className="absolute start-0.5 top-1.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />

              <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1.5 transition-colors hover:border-border">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-foreground">
                    {title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(inc.severity)}
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {inc.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

IncidentTimelineCard.displayName = 'IncidentTimelineCard';
