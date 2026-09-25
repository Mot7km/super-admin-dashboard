import { memo, type FC } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { PlatformHealthItem } from '../analytics.types';
import { PLATFORM_HEALTH_SUBSYSTEMS } from '../analytics.mock';

export const PlatformHealthSummaryCard: FC = memo(() => {
  const { t, isRtl } = useTranslation();

  const getStatusBadge = (status: PlatformHealthItem['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('analytics.health.healthy')}</span>
          </span>
        );
      case 'degraded':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{t('analytics.health.degraded')}</span>
          </span>
        );
      case 'down':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>{t('analytics.health.down')}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground sm:text-base">
              {t('analytics.health.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.health.subtitle')}
            </p>
          </div>
        </div>

        <Link
          to="/system/health"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <span>{t('analytics.health.viewFullDetails')}</span>
          <ExternalLink className={`h-3 w-3 ${isRtl ? 'scale-x-[-1]' : ''}`} />
        </Link>
      </div>

      {/* Subsystems List */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PLATFORM_HEALTH_SUBSYSTEMS.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                {t(item.nameKey)}
              </span>
              {getStatusBadge(item.status)}
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{item.metric}</span>
              {item.latencyMs && (
                <span className="flex items-center gap-0.5 font-mono">
                  <Zap className="h-3 w-3 text-blue-500" />
                  {item.latencyMs}ms
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-500">
        <div className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          <span>{t('analytics.health.allCriticalOperational')}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
          <span>Global Uptime: 99.98%</span>
          <span>•</span>
          <span>Zero Outages in 30 Days</span>
        </div>
      </div>
    </div>
  );
});

PlatformHealthSummaryCard.displayName = 'PlatformHealthSummaryCard';
