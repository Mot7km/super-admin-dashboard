import { memo, type FC } from 'react';
import {
  Headphones,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { SUPPORT_OPERATIONS_DATA } from '../../analytics.mock';

export const SupportSlaOperationsCard: FC = memo(() => {
  const { t } = useTranslation();
  const support = SUPPORT_OPERATIONS_DATA;

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.support.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.support.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{t('analytics.support.totalMonth')}:</span>
          <span className="font-mono font-extrabold text-foreground">
            {support.totalTicketsMonth.toLocaleString()} {t('analytics.support.tickets')}
          </span>
        </div>
      </div>

      {/* Main SLA & Metric Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Open Tickets */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">{t('analytics.support.openTickets')}</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-500 font-mono">
              {support.openTickets}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('analytics.support.activeQueued')}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '32%' }} />
          </div>
        </div>

        {/* Resolved Today */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">{t('analytics.support.resolvedToday')}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-500 font-mono">
              +{support.resolvedToday}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('analytics.support.closedToday')}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* First Response Time (FRT) */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">{t('analytics.support.frt')}</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground font-mono">
              {support.avgFirstResponseMinutes}
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              {t('analytics.support.mins')}
            </span>
          </div>
          <p className="text-[11px] text-emerald-500 font-medium">
            SLA Target: &lt; 30m (Passed)
          </p>
        </div>

        {/* Resolution Time (MTTR) */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">{t('analytics.support.mttr')}</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground font-mono">
              {support.avgResolutionHours}
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              {t('analytics.support.hours')}
            </span>
          </div>
          <p className="text-[11px] text-emerald-500 font-medium">
            SLA Target: &lt; 8.0h (Passed)
          </p>
        </div>
      </div>

      {/* CSAT Customer Satisfaction Banner */}
      <div className="rounded-xl border border-border/60 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-purple-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 shrink-0">
            <ThumbsUp className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">
                {t('analytics.support.csatTitle')}
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-500">
                <Sparkles className="h-3 w-3" />
                {support.csatPercentage}% {t('analytics.support.satisfied')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('analytics.support.csatDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4 w-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-2xl font-black text-foreground font-mono">
            {support.csatScore}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            / 5.0
          </span>
        </div>
      </div>
    </div>
  );
});

SupportSlaOperationsCard.displayName = 'SupportSlaOperationsCard';
