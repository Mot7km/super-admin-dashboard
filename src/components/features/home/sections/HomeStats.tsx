import { memo, useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { HeroKpi, SentinelMetric } from '../home.types';
import { SparklineKpiCard, type SparklineVariant } from '../../../common/kpi';

type HomeStatsProps = {
  heroKpis: HeroKpi[];
  sentinelMetrics: SentinelMetric[];
};

const KPI_VARIANT_MAP: Record<string, SparklineVariant> = {
  'mrr-revenue': 'primary',
  'total-businesses': 'secondary',
  'platform-orders-volume': 'emerald',
  'active-users': 'purple',
};

const HomeStats: FC<HomeStatsProps> = ({ heroKpis, sentinelMetrics }) => {
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();

  // Navigation route mapping for Sentinel Alert Strip
  const sentinelRouteMap: Record<string, string> = useMemo(() => ({
    'expiring-subscriptions': '/subscriptions',
    'churned-businesses': '/businesses',
    'support-tickets': '/support',
    'api-throughput-errors': '/system/system-health',
  }), []);

  return (
    <section aria-label="Key Performance Indicators" className="space-y-4">
      {/* ========================================================================= */}
      {/* TIER 1: The 4 Strategic Headline KPIs (Sparkline Micro-Chart Cards)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {heroKpis.map((kpi) => (
          <SparklineKpiCard
            key={kpi.id}
            title={t(kpi.titleKey)}
            value={kpi.value}
            change={kpi.change}
            changeTrend="up"
            subValue={kpi.subValue}
            icon={kpi.icon}
            variant={KPI_VARIANT_MAP[kpi.id] || 'primary'}
            data={kpi.data}
            dataKey="v"
            formatTooltip={(val: number) => kpi.formatVal(val)}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: Operational Sentinel Alert Strip (Actionable Cards)              */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {sentinelMetrics.map((item) => {
            const variantStyles = {
              warning: {
                text: 'text-warning-text',
                bg: 'bg-warning-bg',
                border: 'border-warning/30',
                badgeBg: 'bg-warning/15 text-warning-text border-warning/30',
              },
              error: {
                text: 'text-destructive-text',
                bg: 'bg-destructive-bg',
                border: 'border-destructive/30',
                badgeBg: 'bg-destructive/15 text-destructive-text border-destructive/30',
              },
              success: {
                text: 'text-success-text',
                bg: 'bg-success-bg',
                border: 'border-success/30',
                badgeBg: 'bg-success/15 text-success-text border-success/30',
              },
              default: {
                text: 'text-primary',
                bg: 'bg-primary/10',
                border: 'border-primary/30',
                badgeBg: 'bg-primary/15 text-primary border-primary/30',
              },
            }[item.variant];

            const route = sentinelRouteMap[item.id] || '/';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(route)}
                className="group flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-surface-subtle/80 transition-all duration-200 cursor-pointer text-start w-full focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                title={`Click to view ${t(item.labelKey)}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-9 w-9 rounded-xl ${variantStyles.bg} ${variantStyles.text} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-muted-foreground block truncate">
                      {t(item.labelKey)}
                    </span>
                    <span className="text-sm font-extrabold text-foreground font-mono tabular-nums block">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 block truncate">
                      {t(item.subtextKey)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                  {item.badge ? (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-pill border ${variantStyles.badgeBg} font-mono`}
                    >
                      {item.badge}
                    </span>
                  ) : null}

                  <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
                    {isRtl ? (
                      <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(HomeStats);