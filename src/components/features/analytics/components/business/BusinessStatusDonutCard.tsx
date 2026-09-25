import { memo, type FC } from 'react';
import {
  PieChart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { BUSINESS_STATUS_DISTRIBUTION } from '../../analytics.mock';

export const BusinessStatusDonutCard: FC = memo(() => {
  const { t } = useTranslation();

  const data = BUSINESS_STATUS_DISTRIBUTION;

  const segments = [
    {
      key: 'active',
      labelKey: 'analytics.status.active',
      count: data.active,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-500/10',
      percent: ((data.active / data.total) * 100).toFixed(1),
      icon: CheckCircle2,
    },
    {
      key: 'trial',
      labelKey: 'analytics.status.trial',
      count: data.trial,
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-500/10',
      percent: ((data.trial / data.total) * 100).toFixed(1),
      icon: Clock,
    },
    {
      key: 'expired',
      labelKey: 'analytics.status.expired',
      count: data.expired,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      percent: ((data.expired / data.total) * 100).toFixed(1),
      icon: AlertCircle,
    },
    {
      key: 'suspended',
      labelKey: 'analytics.status.suspended',
      count: data.suspended,
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-500/10',
      percent: ((data.suspended / data.total) * 100).toFixed(1),
      icon: AlertTriangle,
    },
    {
      key: 'cancelled',
      labelKey: 'analytics.status.cancelled',
      count: data.cancelled,
      color: 'bg-rose-500',
      textColor: 'text-rose-500',
      borderColor: 'border-rose-500/30',
      bgColor: 'bg-rose-500/10',
      percent: ((data.cancelled / data.total) * 100).toFixed(1),
      icon: XCircle,
    },
  ];

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PieChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.status.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.status.subtitle')}
            </p>
          </div>
        </div>

        <div className="text-end">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            {t('analytics.status.totalPool')}
          </span>
          <div className="text-lg font-extrabold text-foreground">
            {data.total.toLocaleString()} {t('analytics.status.businesses')}
          </div>
        </div>
      </div>

      {/* Stacked Proportional Distribution Bar */}
      <div className="space-y-2">
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted p-0.5">
          {segments.map((seg) => (
            <div
              key={seg.key}
              title={`${t(seg.labelKey)}: ${seg.count} (${seg.percent}%)`}
              className={`h-full first:rounded-s-full last:rounded-e-full ${seg.color} transition-all duration-300 hover:opacity-90`}
              style={{ width: `${seg.percent}%` }}
            />
          ))}
        </div>
      </div>

      {/* Segment Breakdown Cards Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((seg) => {
          const Icon = seg.icon;
          return (
            <div
              key={seg.key}
              className={`flex items-center justify-between rounded-xl border ${seg.borderColor} ${seg.bgColor} p-3 transition-transform hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${seg.textColor}`} />
                <div>
                  <div className="text-xs font-bold text-foreground">
                    {t(seg.labelKey)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {seg.percent}% {t('analytics.status.ofTotal')}
                  </div>
                </div>
              </div>

              <div className="text-end">
                <span className={`text-base font-extrabold ${seg.textColor}`}>
                  {seg.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

BusinessStatusDonutCard.displayName = 'BusinessStatusDonutCard';
