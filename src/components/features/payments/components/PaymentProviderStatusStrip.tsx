import { memo, type FC, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Radio,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { PaymentProviderStatus, ProviderHealthStatus } from '../payments.types';

type PaymentProviderStatusStripProps = {
  gateways: PaymentProviderStatus[];
  onOpenGatewayModal?: (provider: PaymentProviderStatus) => void;
};

// Provider visual identity styling
const getProviderBrand = (id: string) => {
  switch (id) {
    case 'stripe':
      return {
        tag: 'STRIPE',
        bgGradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
        accentColor: 'text-violet-400',
        borderColor: 'group-hover:border-violet-500/40',
      };
    case 'paymob':
      return {
        tag: 'PAYMOB',
        bgGradient: 'from-blue-500/10 via-sky-500/5 to-transparent',
        accentColor: 'text-sky-400',
        borderColor: 'group-hover:border-sky-500/40',
      };
    case 'geidea':
      return {
        tag: 'GEIDEA',
        bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
        accentColor: 'text-amber-400',
        borderColor: 'group-hover:border-amber-500/40',
      };
    case 'hyperpay':
      return {
        tag: 'HYPERPAY',
        bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        accentColor: 'text-emerald-400',
        borderColor: 'group-hover:border-emerald-500/40',
      };
    case 'tap':
      return {
        tag: 'TAP',
        bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
        accentColor: 'text-rose-400',
        borderColor: 'group-hover:border-rose-500/40',
      };
    default:
      return {
        tag: 'GW',
        bgGradient: 'from-primary/10 via-primary/5 to-transparent',
        accentColor: 'text-primary',
        borderColor: 'group-hover:border-primary/40',
      };
  }
};

const getStatusBadge = (status: ProviderHealthStatus) => {
  switch (status) {
    case 'operational':
      return {
        labelKey: 'payments.gatewayOperational',
        defaultLabel: 'Operational',
        dotClass: 'bg-emerald-500 animate-pulse',
        badgeClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      };
    case 'degraded_performance':
      return {
        labelKey: 'payments.gatewayDegraded',
        defaultLabel: 'Degraded',
        dotClass: 'bg-amber-500 animate-ping',
        badgeClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      };
    case 'partial_outage':
      return {
        labelKey: 'payments.gatewayOutage',
        defaultLabel: 'Outage',
        dotClass: 'bg-destructive animate-ping',
        badgeClass: 'text-destructive bg-destructive/10 border-destructive/20',
      };
    case 'maintenance':
      return {
        labelKey: 'payments.gatewayMaintenance',
        defaultLabel: 'Maintenance',
        dotClass: 'bg-sky-500',
        badgeClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      };
  }
};

const PaymentProviderStatusStrip: FC<PaymentProviderStatusStripProps> = ({
  gateways,
  onOpenGatewayModal,
}) => {
  const { t } = useTranslation();

  const optimalCount = useMemo(() => {
    return gateways.filter((g) => g.status === 'operational').length;
  }, [gateways]);

  const avgUptime = useMemo(() => {
    if (gateways.length === 0) return '99.9';
    const sum = gateways.reduce((acc, g) => acc + g.uptimePercent, 0);
    return (sum / gateways.length).toFixed(2);
  }, [gateways]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/85 backdrop-blur-md p-3.5 sm:p-4 shadow-xs">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-foreground tracking-tight uppercase font-mono">
                {t('payments.gatewayHealthTitle') || 'Gateway & Processor SLA Telemetry'}
              </h4>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-subtle border border-border text-[10px] font-mono text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync (30s heartbeat)
              </span>
            </div>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center text-[11px] font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-surface-subtle border border-border/80 text-foreground font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>
              {optimalCount}/{gateways.length} Optimal
            </span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold">
            <Zap className="h-3 w-3" />
            <span>{avgUptime}% Uptime</span>
          </span>
        </div>
      </div>

      {/* High-Density Gateway Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-3">
        {gateways.map((gw) => {
          const statusMeta = getStatusBadge(gw.status);
          const brand = getProviderBrand(gw.id);
          const isOptimal = gw.status === 'operational';

          return (
            <div
              key={gw.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenGatewayModal?.(gw)}
              onKeyDown={(e) => e.key === 'Enter' && onOpenGatewayModal?.(gw)}
              className={`group relative overflow-hidden rounded-xl border border-border/70 bg-surface-subtle/40 hover:bg-card p-3 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${brand.borderColor} hover:-translate-y-0.5 hover:shadow-sm`}
            >
              {/* Subtle Brand Ambient Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${brand.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-2.5">
                {/* Provider Title & Status Dot */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.2 rounded bg-surface-elevated border border-border/80 text-[9px] font-black font-mono text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                      {brand.tag}
                    </span>
                    <span className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {gw.name}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 ${statusMeta.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                    <span className="text-[10px]">
                      {t(statusMeta.labelKey) || statusMeta.defaultLabel}
                    </span>
                  </span>
                </div>

                {/* Metrics: Latency + SLA Uptime */}
                <div className="flex items-end justify-between text-xs font-mono border-t border-border/40 pt-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">
                      Latency
                    </span>
                    <div className="flex items-center gap-1 text-foreground font-bold">
                      <Activity className={`h-3 w-3 ${isOptimal ? 'text-emerald-500' : 'text-amber-500'}`} />
                      <span className={gw.latencyMs > 200 ? 'text-amber-500' : 'text-foreground'}>
                        {gw.latencyMs}ms
                      </span>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">
                      30D SLA
                    </span>
                    <span className="font-bold text-foreground">
                      {gw.uptimePercent}%
                    </span>
                  </div>
                </div>

                {/* Subtle Warning Badge if degraded (inline, doesn't break height) */}
                {gw.activeIncidentsCount > 0 && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-warning-text bg-warning-bg/40 px-2 py-0.5 rounded-md border border-warning-text/20">
                    <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
                    <span className="truncate">High latency alert ({gw.latencyMs}ms)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(PaymentProviderStatusStrip);
