import { memo, type FC } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { SYSTEM_ERROR_CATEGORIES } from '../../analytics.mock';

export const SystemErrorFrequencyCard: FC = memo(() => {
  const { t } = useTranslation();

  const categories = SYSTEM_ERROR_CATEGORIES;
  const totalErrors = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.errors.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.errors.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{t('analytics.errors.totalToday')}:</span>
          <span className="font-mono font-extrabold text-rose-500">
            {totalErrors.toLocaleString()} {t('analytics.errors.events')}
          </span>
        </div>
      </div>

      {/* Proportional Stacked Bar */}
      <div className="space-y-2">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted p-0.5">
          {categories.map((c) => (
            <div
              key={c.id}
              title={`${t(c.categoryKey)}: ${c.count} (${c.percent}%)`}
              className={`h-full first:rounded-s-full last:rounded-e-full ${c.color} transition-all duration-300`}
              style={{ width: `${c.percent}%` }}
            />
          ))}
        </div>
      </div>

      {/* Error Category Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-2 hover:bg-background/80 transition-colors"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                <span className="font-bold text-foreground">
                  {t(c.categoryKey)}
                </span>
              </div>
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                {c.httpCode}
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-lg font-extrabold text-foreground">
                {c.count.toLocaleString()}
              </span>
              <span className="font-bold text-muted-foreground">
                {c.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Anomaly Watch Notice */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          <span>{t('analytics.errors.anomalyGuardNotice')}</span>
        </div>
        <span className="font-semibold text-emerald-500 font-mono">
          Zero Critical Severities
        </span>
      </div>
    </div>
  );
});

SystemErrorFrequencyCard.displayName = 'SystemErrorFrequencyCard';
