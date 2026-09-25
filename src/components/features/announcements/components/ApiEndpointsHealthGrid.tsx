import { memo, useState, type FC } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Server,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import { useToast } from '../../../common/Toast';
import type { ApiEndpointHealth } from '../announcements.types';

type ApiEndpointsHealthGridProps = {
  endpoints: ApiEndpointHealth[];
  onRefreshAll: () => void;
};

export const ApiEndpointsHealthGrid: FC<ApiEndpointsHealthGridProps> = memo(({
  endpoints,
  onRefreshAll,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getStatusBadge = (status: ApiEndpointHealth['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OPERATIONAL
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            DEGRADED
          </span>
        );
      case 'down':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            OUTAGE
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between bg-card/60 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Server className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              {t('announcements.api.fleetStatusTitle')}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t('announcements.api.fleetStatusSubtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onRefreshAll();
            showToast(t('announcements.api.pingSuccess'), 'info');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{t('announcements.api.pingAll')}</span>
        </button>
      </div>

      {/* Grid of endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {endpoints.map((ep) => (
          <div
            key={ep.id}
            className="group rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            {/* Header: Title and Status */}
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {ep.name}
                </h5>
                {getStatusBadge(ep.status)}
              </div>

              {/* URL and Version */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {ep.version}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(ep.id, ep.baseUrl)}
                  className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground line-clamp-1 truncate max-w-[200px]"
                  title="Copy base URL"
                >
                  <span className="truncate">{ep.baseUrl}</span>
                  {copiedId === ep.id ? (
                    <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-60 group-hover:opacity-100 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Metrics: Latency and Uptime */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
              <div className="p-2.5 rounded-2xl bg-muted/30 border border-border/60">
                <span className="text-[10px] font-semibold text-muted-foreground block">
                  {t('announcements.api.latency')}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-base font-bold text-foreground">
                    {ep.responseTimeMs}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">ms</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-muted/30 border border-border/60">
                <span className="text-[10px] font-semibold text-muted-foreground block">
                  {t('announcements.api.uptime30d')}
                </span>
                <span className="font-mono text-base font-bold text-emerald-400 mt-0.5 block">
                  {ep.uptimePercentage}%
                </span>
              </div>
            </div>

            {/* Rate Limiting Usage Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px] font-semibold">
                  {t('announcements.api.rateLimit')} ({ep.rateLimitPerMinute}/min)
                </span>
                <span className="font-mono font-bold text-foreground text-[11px]">
                  {ep.rateLimitUsagePercent}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ep.rateLimitUsagePercent > 80
                      ? 'bg-rose-500'
                      : ep.rateLimitUsagePercent > 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${ep.rateLimitUsagePercent}%` }}
                />
              </div>
            </div>

            {/* Footer: CORS and Last Checked */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>CORS: {ep.corsAllowed[0]}</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <Clock className="h-3 w-3" />
                <span>{ep.lastChecked}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ApiEndpointsHealthGrid.displayName = 'ApiEndpointsHealthGrid';
