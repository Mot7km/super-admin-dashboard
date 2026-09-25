import { memo, type FC } from 'react';
import {
  Activity,
  Zap,
  Gauge,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import {
  API_PERFORMANCE_SUMMARY,
  API_TOP_ENDPOINTS,
} from '../../analytics.mock';

export const ApiPerformanceLatencyCard: FC = memo(() => {
  const { t } = useTranslation();

  const summary = API_PERFORMANCE_SUMMARY;
  const endpoints = API_TOP_ENDPOINTS;

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.ops.apiTelemetryTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.ops.apiTelemetrySubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-500 text-xs font-bold shadow-sm">
          <Zap className="h-4 w-4" />
          <span>{summary.successRatePercent}% Global SLA</span>
        </div>
      </div>

      {/* Latency Percentile Gauge Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            {t('analytics.ops.meanLatency')}
          </span>
          <div className="text-xl font-extrabold text-foreground">
            {summary.meanLatencyMs} ms
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold">
            Within Target &lt; 200ms
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            p50 Median
          </span>
          <div className="text-xl font-extrabold text-emerald-500">
            {summary.p50LatencyMs} ms
          </div>
          <div className="text-[11px] text-muted-foreground">
            50% of traffic served
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            p95 Tail
          </span>
          <div className="text-xl font-extrabold text-primary">
            {summary.p95LatencyMs} ms
          </div>
          <div className="text-[11px] text-muted-foreground">
            95% of traffic served
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            p99 Peak
          </span>
          <div className="text-xl font-extrabold text-amber-500">
            {summary.p99LatencyMs} ms
          </div>
          <div className="text-[11px] text-muted-foreground">
            Heaviest reports / queries
          </div>
        </div>
      </div>

      {/* Top Endpoints Table / Rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4 text-primary" />
            {t('analytics.ops.topEndpointsTitle')}
          </span>
          <span className="text-muted-foreground font-normal">
            Sorted by volume
          </span>
        </div>

        <div className="space-y-2.5">
          {endpoints.map((ep) => {
            const isWarning = ep.status === 'warning';
            let methodBg = 'bg-primary/10 text-primary border-primary/20';
            if (ep.method === 'POST') methodBg = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';

            return (
              <div
                key={ep.id}
                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/50 p-3.5 sm:flex-row sm:items-center sm:justify-between text-xs hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-lg border px-2 py-0.5 font-mono text-[10px] font-extrabold ${methodBg}`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {ep.endpoint}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="font-mono text-muted-foreground">
                    {ep.callsCount.toLocaleString()} {t('analytics.ops.calls')}
                  </span>

                  <span className="font-mono font-semibold text-foreground w-16 text-end">
                    {ep.avgLatencyMs} ms
                  </span>

                  <div className="flex items-center gap-1 w-20 justify-end">
                    {isWarning ? (
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {ep.errorRatePercent}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-500 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {ep.errorRatePercent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

ApiPerformanceLatencyCard.displayName = 'ApiPerformanceLatencyCard';
